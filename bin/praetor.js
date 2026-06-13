#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const os = require("os");
const { execSync } = require("child_process");

const PKG_ROOT = path.join(__dirname, "..");
const PROMPT_DIR = path.join(PKG_ROOT, "prompt");
const MASTER_PROMPT = path.join(PROMPT_DIR, "00-orchestrator", "MASTER_PROMPT.md");
const VERSION = "2.8.5";

const args = process.argv.slice(2);

// ---------------------------------------------------------------------------
// Agentic tool definitions — each knows how to detect + install
// ---------------------------------------------------------------------------

const TOOLS = [
  {
    name: "Claude Code",
    detect: () => !!safeWhich("claude"),
    skillDir: () => path.join(os.homedir(), ".claude", "skills", "praetor"),
    install: function () {
      const dest = this.skillDir();
      copyDir(PROMPT_DIR, dest);
      return { dest, files: countFiles(dest) };
    },
  },
  {
    name: "OpenCode",
    detect: () => !!safeWhich("opencode"),
    skillDir: () => path.join(os.homedir(), ".opencode", "skills", "praetor"),
    install: function () {
      const dest = this.skillDir();
      copyDir(PROMPT_DIR, dest);
      return { dest, files: countFiles(dest) };
    },
  },
  {
    name: "Cursor",
    detect: () => {
      // Cursor stores rules per-project, but also has global rules
      // Check if Cursor is installed (macOS/Linux/Windows)
      if (process.platform === "darwin") {
        return fs.existsSync("/Applications/Cursor.app");
      }
      return !!safeWhich("cursor");
    },
    ruleFile: () => {
      // Cursor global rules file
      const configDir =
        process.platform === "darwin"
          ? path.join(os.homedir(), ".cursor", "rules")
          : path.join(os.homedir(), ".cursor", "rules");
      return path.join(configDir, "praetor.mdc");
    },
    install: function () {
      const ruleFile = this.ruleFile();
      const dir = path.dirname(ruleFile);
      fs.mkdirSync(dir, { recursive: true });
      // Build a Cursor-compatible .mdc rule from SKILL.md
      const skillContent = fs.readFileSync(
        path.join(PROMPT_DIR, "SKILL.md"),
        "utf-8"
      );
      const ruleContent = buildCursorRule(skillContent);
      fs.writeFileSync(ruleFile, ruleContent, "utf-8");
      return { dest: ruleFile, files: 1 };
    },
  },
];

// ---------------------------------------------------------------------------
// Pre-flight checks
// ---------------------------------------------------------------------------

function preflight() {
  const checks = [];
  let passed = 0;
  let failed = 0;

  // 1. Node.js version (>= 16)
  const nodeVersion = process.versions.node;
  const nodeMajor = parseInt(nodeVersion.split(".")[0], 10);
  if (nodeMajor >= 16) {
    checks.push({ label: "Node.js >= 16", status: "OK", detail: "v" + nodeVersion });
    passed++;
  } else {
    checks.push({ label: "Node.js >= 16", status: "FAIL", detail: "v" + nodeVersion + " (need >= 16)" });
    failed++;
  }

  // 2. Home directory writable
  const home = os.homedir();
  const canWriteHome = canWrite(home);
  checks.push({
    label: "Home dir writable",
    status: canWriteHome ? "OK" : "FAIL",
    detail: home,
  });
  canWriteHome ? passed++ : failed++;

  // 3. Disk space (> 10 MB free)
  try {
    const stats = fs.statfsSync(home);
    const freeMB = Math.round((stats.bavail * stats.bsize) / (1024 * 1024));
    const ok = freeMB > 10;
    checks.push({ label: "Disk space (> 10 MB)", status: ok ? "OK" : "FAIL", detail: freeMB + " MB free" });
    ok ? passed++ : failed++;
  } catch {
    // statfs not available on some platforms
    checks.push({ label: "Disk space (> 10 MB)", status: "WARN", detail: "cannot check" });
    passed++;
  }

  // 4. Skill source files present
  const hasSource = fs.existsSync(PROMPT_DIR) && fs.existsSync(path.join(PROMPT_DIR, "SKILL.md"));
  checks.push({
    label: "Skill source files",
    status: hasSource ? "OK" : "FAIL",
    detail: hasSource ? countFiles(PROMPT_DIR) + " files" : "missing",
  });
  hasSource ? passed++ : failed++;

  // 5. Detect agentic tools
  const found = TOOLS.filter((t) => t.detect());
  if (found.length > 0) {
    checks.push({ label: "Agentic tools detected", status: "OK", detail: found.map((t) => t.name).join(", ") });
    passed++;
  } else {
    checks.push({ label: "Agentic tools detected", status: "WARN", detail: "none found — will install to all supported locations" });
    passed++;
  }

  return { checks, passed, failed, found };
}

function canWrite(dir) {
  try {
    const testFile = path.join(dir, ".praetor-write-test-" + Date.now());
    fs.writeFileSync(testFile, "test");
    fs.unlinkSync(testFile);
    return true;
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// Install — auto-detect or target specific tool
// ---------------------------------------------------------------------------

function installSkill(targetTool) {
  console.log("");
  console.log("  ╔══════════════════════════════════════════════════════════════╗");
  console.log("  ║  PRAETOR v" + VERSION + " — Installing                                       ║");
  console.log("  ╚══════════════════════════════════════════════════════════════╝");
  console.log("");

  // Pre-flight
  const pf = preflight();

  console.log("  Pre-flight checks:");
  for (const c of pf.checks) {
    const icon = c.status === "OK" ? "✓" : c.status === "WARN" ? "!" : "✗";
    const color = c.status === "OK" ? "" : c.status === "WARN" ? "" : "";
    console.log("    " + icon + "  " + c.label + ": " + c.detail);
  }
  console.log("");

  // Block on hard failures
  const hardFails = pf.checks.filter((c) => c.status === "FAIL");
  if (hardFails.length > 0) {
    console.error("  Aborting: " + hardFails.length + " check(s) failed.");
    for (const f of hardFails) {
      console.error("    ✗  " + f.label + ": " + f.detail);
    }
    console.error("");
    console.error("  Fix the above issues and re-run: npx praetor-audit-kit --install");
    process.exit(1);
  }

  // Determine targets
  let targets;
  if (targetTool) {
    const match = TOOLS.find(
      (t) => t.name.toLowerCase() === targetTool.toLowerCase()
    );
    if (!match) {
      console.error("  Unknown tool: " + targetTool);
      console.error("  Supported: " + TOOLS.map((t) => t.name).join(", "));
      process.exit(1);
    }
    targets = [match];
  } else {
    // Install to all detected tools, or all tools if none detected
    const detected = TOOLS.filter((t) => t.detect());
    targets = detected.length > 0 ? detected : TOOLS;
  }

  // Permission check for each target — try to create parent dirs
  for (const tool of targets) {
    const dest = tool.skillDir ? tool.skillDir() : tool.ruleFile();
    const parentDir = path.dirname(dest);
    try {
      fs.mkdirSync(parentDir, { recursive: true });
    } catch (err) {
      console.error("  ✗  " + tool.name + ": Cannot create " + parentDir);
      console.error("     " + err.message);
      process.exit(1);
    }
    if (!canWrite(parentDir)) {
      console.error("  ✗  " + tool.name + ": Cannot write to " + parentDir);
      console.error("     Run with appropriate permissions.");
      process.exit(1);
    }
  }

  // Install
  let installed = 0;
  for (const tool of targets) {
    try {
      const result = tool.install();
      console.log("  ✓  " + tool.name + " → " + result.dest + " (" + result.files + " files)");
      installed++;
    } catch (err) {
      console.error("  ✗  " + tool.name + ": " + err.message);
    }
  }

  console.log("");
  if (installed > 0) {
    console.log("  Installed to " + installed + " tool(s). Restart your agentic tool to activate.");
    console.log("");
    console.log("  Usage:");
    console.log("    Start a new session, then: /praetor");
    console.log("    (or mention \"audit\", \"production readiness\", etc.)");
  } else {
    console.error("  No tools installed. Check errors above.");
    process.exit(1);
  }
  console.log("");
}

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

function safeWhich(cmd) {
  try {
    const result = execSync("which " + cmd + " 2>/dev/null", {
      encoding: "utf-8",
      stdio: ["pipe", "pipe", "pipe"],
    }).trim();
    return result || null;
  } catch {
    return null;
  }
}

function copyDir(src, dest) {
  if (fs.existsSync(dest)) {
    fs.rmSync(dest, { recursive: true, force: true });
  }
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === ".DS_Store") continue;
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function countFiles(dir) {
  let count = 0;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === ".DS_Store") continue;
    const p = path.join(dir, entry.name);
    count += entry.isDirectory() ? countFiles(p) : 1;
  }
  return count;
}

function buildCursorRule(skillContent) {
  // Extract frontmatter fields
  const fm = {};
  const fmMatch = skillContent.match(/^---\n([\s\S]*?)\n---/);
  if (fmMatch) {
    for (const line of fmMatch[1].split("\n")) {
      const kv = line.match(/^(\w+):\s*"?([^"]*)"?\s*$/);
      if (kv) fm[kv[1]] = kv[2];
    }
  }
  const body = skillContent.replace(/^---[\s\S]*?---\n*/, "");

  return [
    "---",
    "description: " + (fm.description || "Praetor audit skill").slice(0, 200),
    "globs:",
    "alwaysApply: false",
    "---",
    "",
    "# Praetor — " + (fm.name || "audit"),
    "",
    body.trim(),
    "",
  ].join("\n");
}

function showPrompt() {
  if (!fs.existsSync(MASTER_PROMPT)) {
    console.error("Error: Master prompt not found at", MASTER_PROMPT);
    process.exit(1);
  }
  const content = fs.readFileSync(MASTER_PROMPT, "utf-8");
  const match = content.match(/\n═══{10,}/);
  console.log(match ? content.slice(match.index + 1) : content);
}

function showPath() {
  console.log(path.resolve(MASTER_PROMPT));
}

// ---------------------------------------------------------------------------
// CLI routing
// ---------------------------------------------------------------------------

const arg = args[0];
const flag = args[1];

if (arg === "--install" || arg === "-i") {
  installSkill(flag || null);
} else if (arg === "--prompt" || arg === "-p") {
  showPrompt();
} else if (arg === "--path" || arg === "-l") {
  showPath();
} else if (arg === "--check" || arg === "-c") {
  const pf = preflight();
  console.log("");
  for (const c of pf.checks) {
    const icon = c.status === "OK" ? "✓" : c.status === "WARN" ? "!" : "✗";
    console.log("  " + icon + "  " + c.label + ": " + c.detail);
  }
  console.log("");
  console.log("  " + pf.passed + " passed, " + pf.failed + " failed");
  console.log("");
} else if (arg === "--help" || arg === "-h") {
  console.log("");
  console.log("  praetor-audit-kit v" + VERSION);
  console.log("");
  console.log("  Usage: npx praetor-audit-kit [option] [tool]");
  console.log("");
  console.log("  Options:");
  console.log("    -i, --install [tool]  Install skill (auto-detects agentic tools)");
  console.log("    -c, --check           Pre-flight check without installing");
  console.log("    -p, --prompt          Output the master prompt to stdout");
  console.log("    -l, --path            Show path to MASTER_PROMPT.md");
  console.log("    -h, --help            Show this help message");
  console.log("");
  console.log("  Supported tools:");
  for (const t of TOOLS) {
    console.log("    " + t.name);
  }
  console.log("");
  console.log("  Examples:");
  console.log("    npx praetor-audit-kit --install            # auto-detect & install");
  console.log("    npx praetor-audit-kit --install \"Claude Code\"  # specific tool");
  console.log("    npx praetor-audit-kit --check              # pre-flight only");
  console.log("    npx praetor-audit-kit --prompt > audit.txt");
  console.log("");
} else {
  // Default: banner + install hint
  console.log("");
  console.log("  ╔══════════════════════════════════════════════════════════════╗");
  console.log("  ║  PRAETOR v" + VERSION + " — Production Readiness & Audit System        ║");
  console.log("  ║  18 Expert Agents · 4-Judge QC · 100% File-Line Traceability ║");
  console.log("  ╚══════════════════════════════════════════════════════════════╝");
  console.log("");
  console.log("  Install:");
  console.log("    npx praetor-audit-kit --install            # auto-detect tools");
  console.log("    npx praetor-audit-kit --install \"OpenCode\"  # specific tool");
  console.log("    npx praetor-audit-kit --check              # pre-flight only");
  console.log("");
  console.log("  Docs: https://github.com/Harery/Praetor");
  console.log("");
}
