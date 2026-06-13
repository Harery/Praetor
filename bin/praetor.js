#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const os = require("os");
const { execSync } = require("child_process");
const https = require("https");

const PKG_ROOT = path.join(__dirname, "..");
const PROMPT_DIR = path.join(PKG_ROOT, "prompt");
const MASTER_PROMPT = path.join(PROMPT_DIR, "00-orchestrator", "MASTER_PROMPT.md");
const VERSION = "2.8.5";

const args = process.argv.slice(2);

// ---------------------------------------------------------------------------
// Agentic tool definitions
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
      if (process.platform === "darwin") return fs.existsSync("/Applications/Cursor.app");
      return !!safeWhich("cursor");
    },
    ruleFile: () => path.join(os.homedir(), ".cursor", "rules", "praetor.mdc"),
    install: function () {
      const ruleFile = this.ruleFile();
      const dir = path.dirname(ruleFile);
      fs.mkdirSync(dir, { recursive: true });
      const skillContent = fs.readFileSync(path.join(PROMPT_DIR, "SKILL.md"), "utf-8");
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

  // 1. Node.js >= 16
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
  checks.push({ label: "Home dir writable", status: canWriteHome ? "OK" : "FAIL", detail: home });
  canWriteHome ? passed++ : failed++;

  // 3. Disk space
  try {
    const stats = fs.statfsSync(home);
    const freeMB = Math.round((stats.bavail * stats.bsize) / (1024 * 1024));
    const ok = freeMB > 10;
    checks.push({ label: "Disk space (> 10 MB)", status: ok ? "OK" : "FAIL", detail: freeMB + " MB free" });
    ok ? passed++ : failed++;
  } catch {
    checks.push({ label: "Disk space (> 10 MB)", status: "WARN", detail: "cannot check" });
    passed++;
  }

  // 4. Skill source files
  const hasSource = fs.existsSync(PROMPT_DIR) && fs.existsSync(path.join(PROMPT_DIR, "SKILL.md"));
  checks.push({ label: "Skill source files", status: hasSource ? "OK" : "FAIL", detail: hasSource ? countFiles(PROMPT_DIR) + " files" : "missing" });
  hasSource ? passed++ : failed++;

  // 5. Agentic tools
  const found = TOOLS.filter((t) => t.detect());
  if (found.length > 0) {
    checks.push({ label: "Agentic tools detected", status: "OK", detail: found.map((t) => t.name).join(", ") });
    passed++;
  } else {
    checks.push({ label: "Agentic tools detected", status: "WARN", detail: "none found" });
    passed++;
  }

  // 6. Version check (P2-8)
  try {
    const latest = getLatestVersion();
    if (latest && latest !== VERSION) {
      checks.push({ label: "Version", status: "WARN", detail: "local " + VERSION + " · latest " + latest + " (run --update)" });
      passed++;
    } else if (latest === VERSION) {
      checks.push({ label: "Version", status: "OK", detail: VERSION + " (latest)" });
      passed++;
    }
  } catch {
    checks.push({ label: "Version", status: "OK", detail: VERSION + " (check skipped)" });
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
// Version check (P2-8) — non-blocking npm registry lookup
// ---------------------------------------------------------------------------

function getLatestVersion() {
  try {
    const result = execSync("npm view praetor-audit-kit version 2>/dev/null", {
      encoding: "utf-8", stdio: ["pipe", "pipe", "pipe"], timeout: 5000,
    }).trim();
    return result || null;
  } catch {
    return null;
  }
}

function updateSelf() {
  console.log("");
  console.log("  Updating praetor-audit-kit...");
  try {
    execSync("npm install -g praetor-audit-kit@latest 2>&1", {
      encoding: "utf-8", stdio: "inherit", timeout: 60000,
    });
    console.log("");
    console.log("  ✓ Updated successfully. Re-run with your preferred flag.");
  } catch (err) {
    console.error("  ✗ Update failed. Try: npx praetor-audit-kit@latest --install");
  }
  console.log("");
}

// ---------------------------------------------------------------------------
// Install
// ---------------------------------------------------------------------------

function installSkill(targetTool) {
  console.log("");
  console.log("  ╔══════════════════════════════════════════════════════════════╗");
  console.log("  ║  PRAETOR v" + VERSION + " — Installing                                       ║");
  console.log("  ╚══════════════════════════════════════════════════════════════╝");
  console.log("");

  const pf = preflight();

  console.log("  Pre-flight checks:");
  for (const c of pf.checks) {
    const icon = c.status === "OK" ? "✓" : c.status === "WARN" ? "!" : "✗";
    console.log("    " + icon + "  " + c.label + ": " + c.detail);
  }
  console.log("");

  const hardFails = pf.checks.filter((c) => c.status === "FAIL");
  if (hardFails.length > 0) {
    console.error("  Aborting: " + hardFails.length + " check(s) failed.");
    for (const f of hardFails) console.error("    ✗  " + f.label + ": " + f.detail);
    console.error("");
    console.error("  Fix the above and re-run: npx praetor-audit-kit --install");
    process.exit(1);
  }

  let targets;
  if (targetTool) {
    const match = TOOLS.find((t) => t.name.toLowerCase() === targetTool.toLowerCase());
    if (!match) {
      console.error("  Unknown tool: " + targetTool);
      console.error("  Supported: " + TOOLS.map((t) => t.name).join(", "));
      process.exit(1);
    }
    targets = [match];
  } else {
    const detected = TOOLS.filter((t) => t.detect());
    targets = detected.length > 0 ? detected : TOOLS;
  }

  for (const tool of targets) {
    const dest = tool.skillDir ? tool.skillDir() : tool.ruleFile();
    const parentDir = path.dirname(dest);
    try { fs.mkdirSync(parentDir, { recursive: true }); } catch (err) {
      console.error("  ✗  " + tool.name + ": Cannot create " + parentDir);
      process.exit(1);
    }
    if (!canWrite(parentDir)) {
      console.error("  ✗  " + tool.name + ": Cannot write to " + parentDir);
      process.exit(1);
    }
  }

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
// Uninstall (P1-5)
// ---------------------------------------------------------------------------

function uninstallSkill() {
  console.log("");
  console.log("  ╔══════════════════════════════════════════════════════════════╗");
  console.log("  ║  PRAETOR v" + VERSION + " — Uninstalling                                    ║");
  console.log("  ╚══════════════════════════════════════════════════════════════╝");
  console.log("");

  let removed = 0;

  for (const tool of TOOLS) {
    const locations = [];
    if (tool.skillDir) locations.push(tool.skillDir());
    if (tool.ruleFile) locations.push(tool.ruleFile());

    for (const loc of locations) {
      if (fs.existsSync(loc)) {
        try {
          fs.rmSync(loc, { recursive: true, force: true });
          console.log("  ✓  Removed " + tool.name + " → " + loc);
          removed++;
        } catch (err) {
          console.error("  ✗  Failed to remove " + loc + ": " + err.message);
        }
      }
    }
  }

  console.log("");
  if (removed > 0) {
    console.log("  Uninstalled from " + removed + " location(s).");
  } else {
    console.log("  Nothing to uninstall — Praetor was not installed.");
  }
  console.log("");
}

// ---------------------------------------------------------------------------
// Scope selector (P0-3 + P2-10) — --scope flag for CLI/CI use
// ---------------------------------------------------------------------------

function showScope(input) {
  const manifest = JSON.parse(fs.readFileSync(path.join(PROMPT_DIR, "scripts", "scopes.json"), "utf-8"));
  const scopes = manifest.scopes;

  // Build alias map
  const aliasMap = {};
  for (let i = 0; i < scopes.length; i++) {
    aliasMap[String(i + 1)] = i;
    for (const a of scopes[i].aliases) aliasMap[a.toLowerCase()] = i;
  }

  function resolve(key) {
    const k = key.trim().toLowerCase();
    if (k in aliasMap) return aliasMap[k];
    return -1;
  }

  // Parse: could be number, alias, range, comma-list
  const trimmed = (input || "").trim();
  const indices = new Set();

  if (trimmed === "") {
    // Interactive — launch scope selector
    require(path.join(PROMPT_DIR, "scripts", "scope-select.js"));
    return;
  }

  for (const part of trimmed.split(",")) {
    const p = part.trim();
    if (p.includes("-")) {
      const [startStr, endStr] = p.split("-");
      const startIdx = resolve(startStr);
      const endIdx = resolve(endStr);
      if (startIdx >= 0 && endIdx >= 0) {
        for (let i = startIdx; i <= endIdx; i++) indices.add(i);
      }
    } else {
      const idx = resolve(p);
      if (idx >= 0) indices.add(idx);
    }
  }

  if (indices.size === 0) {
    console.error("  Unknown scope: " + input);
    console.error("  Available: 1-8, or aliases: full, eng, sec, biz, ops, sup, risk, quick");
    process.exit(1);
  }

  const selected = Array.from(indices).sort().map((i) => scopes[i]);

  console.log("");
  for (const s of selected) {
    const tag = s.tag ? " [" + s.tag + "]" : "";
    console.log("  ✓ " + s.label + tag);
    console.log("    Agents: " + s.agents.join(", ") + " · Categories: " + s.categories.join(", "));
    if (s.sub) {
      for (const sub of s.sub) {
        console.log("      ● " + sub.name + ": " + sub.items);
      }
    }
    console.log("");
  }
}

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

function safeWhich(cmd) {
  try {
    return execSync("which " + cmd + " 2>/dev/null", { encoding: "utf-8", stdio: ["pipe", "pipe", "pipe"] }).trim() || null;
  } catch { return null; }
}

function copyDir(src, dest) {
  if (fs.existsSync(dest)) fs.rmSync(dest, { recursive: true, force: true });
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (entry.name === ".DS_Store") continue;
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(srcPath, destPath);
    else fs.copyFileSync(srcPath, destPath);
  }
}

function countFiles(dir) {
  let count = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === ".DS_Store") continue;
    const p = path.join(dir, entry.name);
    count += entry.isDirectory() ? countFiles(p) : 1;
  }
  return count;
}

function buildCursorRule(skillContent) {
  const fm = {};
  const fmMatch = skillContent.match(/^---\n([\s\S]*?)\n---/);
  if (fmMatch) {
    for (const line of fmMatch[1].split("\n")) {
      const kv = line.match(/^(\w+):\s*"?([^"]*)"?$/);
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
} else if (arg === "--uninstall" || arg === "-u") {
  uninstallSkill();
} else if (arg === "--scope" || arg === "-s") {
  showScope(flag || "");
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
} else if (arg === "--update") {
  updateSelf();
} else if (arg === "--help" || arg === "-h") {
  console.log("");
  console.log("  praetor-audit-kit v" + VERSION);
  console.log("");
  console.log("  Usage: npx praetor-audit-kit [option] [arg]");
  console.log("");
  console.log("  Options:");
  console.log("    -i, --install [tool]   Install skill (auto-detects agentic tools)");
  console.log("    -u, --uninstall        Remove installed skill from all tools");
  console.log("    -s, --scope [scope]    Show scope details (number, alias, range)");
  console.log("    -c, --check            Pre-flight check without installing");
  console.log("    --update               Update to latest version from npm");
  console.log("    -p, --prompt           Output the master prompt to stdout");
  console.log("    -l, --path             Show path to MASTER_PROMPT.md");
  console.log("    -h, --help             Show this help message");
  console.log("");
  console.log("  Scope aliases:");
  console.log("    full, eng, sec, biz, ops, sup, risk, quick");
  console.log("    (or numbers 1-8, ranges like 2-4, comma lists like 3,5)");
  console.log("");
  console.log("  Examples:");
  console.log("    npx praetor-audit-kit --install");
  console.log("    npx praetor-audit-kit --install \"Claude Code\"");
  console.log("    npx praetor-audit-kit --scope biz");
  console.log("    npx praetor-audit-kit --scope 2-4");
  console.log("    npx praetor-audit-kit --uninstall");
  console.log("    npx praetor-audit-kit --check");
  console.log("    npx praetor-audit-kit --update");
  console.log("");
} else {
  // Default: banner
  console.log("");
  console.log("  ╔══════════════════════════════════════════════════════════════╗");
  console.log("  ║  PRAETOR v" + VERSION + " — Production Readiness & Audit System        ║");
  console.log("  ║  18 Expert Agents · 4-Judge QC · 100% File-Line Traceability ║");
  console.log("  ╚══════════════════════════════════════════════════════════════╝");
  console.log("");
  console.log("  Install:");
  console.log("    npx praetor-audit-kit --install            # auto-detect tools");
  console.log("    npx praetor-audit-kit --install \"OpenCode\"  # specific tool");
  console.log("");
  console.log("  Scope:");
  console.log("    npx praetor-audit-kit --scope biz          # show Business scope");
  console.log("    npx praetor-audit-kit --scope 2-4          # show range");
  console.log("    npx praetor-audit-kit --scope              # interactive selector");
  console.log("");
  console.log("  Other:");
  console.log("    npx praetor-audit-kit --check              # pre-flight only");
  console.log("    npx praetor-audit-kit --uninstall          # remove skill");
  console.log("    npx praetor-audit-kit --update             # update to latest");
  console.log("");
  console.log("  Docs: https://github.com/Harery/Praetor");
  console.log("");
}
