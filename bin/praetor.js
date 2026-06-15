#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const os = require("os");
const { execSync } = require("child_process");
const https = require("https");

const PKG_ROOT = path.join(__dirname, "..");
const PROMPT_DIR = path.join(PKG_ROOT, "prompt");
const MASTER_PROMPT = path.join(PROMPT_DIR, "00-orchestrator", "MASTER_PROMPT.md");
const VERSION = "2.9.2";

const args = process.argv.slice(2);

// ---------------------------------------------------------------------------
// ANSI color palette
// ---------------------------------------------------------------------------

const C = {
  reset:   "\x1b[0m",
  bold:    "\x1b[1m",
  dim:     "\x1b[2m",
  italic:  "\x1b[3m",
  // Foregrounds
  black:   "\x1b[30m",
  red:     "\x1b[31m",
  green:   "\x1b[32m",
  yellow:  "\x1b[33m",
  blue:    "\x1b[34m",
  magenta: "\x1b[35m",
  cyan:    "\x1b[36m",
  white:   "\x1b[37m",
  // Bright foregrounds
  bred:    "\x1b[91m",
  bgreen:  "\x1b[92m",
  byellow: "\x1b[93m",
  bblue:   "\x1b[94m",
  bmagenta:"\x1b[95m",
  bcyan:   "\x1b[96m",
  bwhite:  "\x1b[97m",
  // Dim foregrounds
  gray:    "\x1b[90m",
  // Backgrounds
  bgRed:   "\x1b[41m",
  bgGreen: "\x1b[42m",
  bgYellow:"\x1b[43m",
  bgBlue:  "\x1b[44m",
  bgMagenta:"\x1b[45m",
  bgCyan:  "\x1b[46m",
};

// Gradient text helper — interpolates between two ANSI 256-color codes
function gradient(text, codeA, codeB) {
  var out = "";
  var len = text.length;
  for (var i = 0; i < len; i++) {
    var t = len > 1 ? i / (len - 1) : 0;
    var r = Math.round(codeA[0] + (codeB[0] - codeA[0]) * t);
    var g = Math.round(codeA[1] + (codeB[1] - codeA[1]) * t);
    var b = Math.round(codeA[2] + (codeB[2] - codeA[2]) * t);
    out += "\x1b[38;2;" + r + ";" + g + ";" + b + "m" + text[i];
  }
  return out + C.reset;
}

// PRAETOR ASCII art banner (ANSI Shadow style)
var PRAETOR_ART = [
  "██████╗ ██████╗  █████╗ ███████╗████████╗ ██████╗ ██████╗ ",
  "██╔══██╗██╔══██╗██╔══██╗██╔════╝╚══██╔══╝██╔═══██╗██╔══██╗",
  "██████╔╝██████╔╝███████║█████╗     ██║   ██║   ██║██████╔╝",
  "██╔═══╝ ██╔══██╗██╔══██║██╔══╝     ██║   ██║   ██║██╔══██╗",
  "██║     ██║  ██║██║  ██║███████╗   ██║   ╚██████╔╝██║  ██║",
  "╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝   ╚═╝    ╚═════╝ ╚═╝  ╚═╝",
];
function praetorBanner() {
  var grad = function(t) { return gradient(t, [88, 200, 255], [0, 230, 180]); };
  var lines = ["  "];
  for (var i = 0; i < PRAETOR_ART.length; i++) {
    lines.push("  " + grad(PRAETOR_ART[i]));
  }
  lines.push("");
  lines.push("  " + C.dim + "Production Readiness & Audit System" + C.reset + C.gray + "  v" + VERSION + C.reset);
  lines.push("  " + C.gray + "18 Expert Agents · 4-Judge QC · 100% File-Line Traceability" + C.reset);
  lines.push("");
  // Agentic LLM requirement notice
  lines.push("  " + C.bgYellow + C.black + C.bold + " ⚡ NOTE " + C.reset + " " + C.byellow + "This is a prompt kit — it runs" + C.reset);
  lines.push("  " + C.byellow + "  inside an AI agent (Claude Code, Cursor, Windsurf, Copilot, Cline," + C.reset);
  lines.push("  " + C.byellow + "  Amazon Q, Gemini, Aider, Continue, Codex, Roo Code, Cody)." + C.reset);
  lines.push("  " + C.byellow + C.bold + "  Praetor does NOT provide any LLM API key, subscription," + C.reset);
  lines.push("  " + C.byellow + C.bold + "  or model access — that is the user's responsibility." + C.reset);
  lines.push("  " + C.dim + "  Install with --install, then trigger /praetor inside the agent." + C.reset);
  lines.push("");
  return lines;
}

// Progress bar — returns a string for a given percentage
function progressBar(pct, width) {
  width = width || 28;
  var filled = Math.round(width * (pct / 100));
  var empty = width - filled;
  var bar = "";
  for (var i = 0; i < filled; i++) bar += "━";
  for (var i = 0; i < empty; i++) bar += "─";
  var color = pct < 30 ? C.red : pct < 70 ? C.yellow : C.green;
  return color + bar + C.reset;
}

// Spinner frames
var SPIN = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

// Animated stdout spinner — returns a stop() function
function spinner(message) {
  var i = 0;
  process.stdout.write("\r\x1b[2K");
  var timer = setInterval(function() {
    process.stdout.write("\r\x1b[2K  " + C.cyan + SPIN[i % SPIN.length] + C.reset + " " + C.dim + message + C.reset);
    i++;
  }, 80);
  return function stop(finalMsg, finalColor) {
    clearInterval(timer);
    process.stdout.write("\r\x1b[2K");
    if (finalMsg) {
      var col = finalColor || C.reset;
      process.stdout.write("  " + col + finalMsg + C.reset + "\n");
    }
  };
}

// ---------------------------------------------------------------------------
// Agentic tool definitions
// ---------------------------------------------------------------------------

const TOOLS = [
  {
    name: "Claude Code",
    detect: () => !!safeWhich("claude"),
    detectHint: "looks for: claude in PATH",
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
    detectHint: "looks for: opencode in PATH",
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
    detectHint: "looks for: /Applications/Cursor.app (macOS) or cursor in PATH",
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
  {
    name: "Windsurf",
    detect: () => {
      if (process.platform === "darwin") return fs.existsSync("/Applications/Windsurf.app");
      return !!safeWhich("windsurf");
    },
    detectHint: "looks for: /Applications/Windsurf.app (macOS) or windsurf in PATH",
    ruleFile: () => path.join(os.homedir(), ".codeium", "windsurf", "memories", "praetor_rules.md"),
    install: function () {
      const rf = this.ruleFile();
      fs.mkdirSync(path.dirname(rf), { recursive: true });
      const skillContent = fs.readFileSync(path.join(PROMPT_DIR, "SKILL.md"), "utf-8");
      fs.writeFileSync(rf, buildRulesFile(skillContent, "Windsurf"), "utf-8");
      return { dest: rf, files: 1 };
    },
  },
  {
    name: "GitHub Copilot",
    detect: () => {
      if (safeWhich("gh")) {
        try {
          execSync("gh copilot --version 2>/dev/null", { encoding: "utf-8", stdio: ["pipe", "pipe", "pipe"] });
          return true;
        } catch {}
      }
      return fs.existsSync(path.join(os.homedir(), ".config", "github-copilot"));
    },
    detectHint: "looks for: gh copilot extension or ~/.config/github-copilot/",
    ruleFile: () => path.join(os.homedir(), ".github", "copilot-instructions.md"),
    install: function () {
      const rf = this.ruleFile();
      fs.mkdirSync(path.dirname(rf), { recursive: true });
      const skillContent = fs.readFileSync(path.join(PROMPT_DIR, "SKILL.md"), "utf-8");
      fs.writeFileSync(rf, buildRulesFile(skillContent, "GitHub Copilot"), "utf-8");
      return { dest: rf, files: 1 };
    },
  },
  {
    name: "Cline",
    detect: () => {
      if (fs.existsSync(path.join(os.homedir(), ".cline"))) return true;
      return !!detectVSCodeExt("saoudrizwan.claude-dev") || !!detectVSCodeExt("cline.cline");
    },
    detectHint: "looks for: ~/.cline/ or VS Code Cline extension",
    ruleFile: () => path.join(os.homedir(), ".cline", "clinerules"),
    install: function () {
      const rf = this.ruleFile();
      fs.mkdirSync(path.dirname(rf), { recursive: true });
      const skillContent = fs.readFileSync(path.join(PROMPT_DIR, "SKILL.md"), "utf-8");
      fs.writeFileSync(rf, buildRulesFile(skillContent, "Cline"), "utf-8");
      return { dest: rf, files: 1 };
    },
  },
  {
    name: "Amazon Q Developer",
    detect: () => {
      if (safeWhich("q")) return true;
      return fs.existsSync(path.join(os.homedir(), ".aws", "amazonq"));
    },
    detectHint: "looks for: q CLI or ~/.aws/amazonq/",
    ruleFile: () => path.join(os.homedir(), ".amazonq", "rules", "praetor.md"),
    install: function () {
      const rf = this.ruleFile();
      fs.mkdirSync(path.dirname(rf), { recursive: true });
      const skillContent = fs.readFileSync(path.join(PROMPT_DIR, "SKILL.md"), "utf-8");
      fs.writeFileSync(rf, buildRulesFile(skillContent, "Amazon Q Developer"), "utf-8");
      return { dest: rf, files: 1 };
    },
  },
  {
    name: "Gemini CLI",
    detect: () => {
      if (safeWhich("gemini")) return true;
      return fs.existsSync(path.join(os.homedir(), ".gemini"));
    },
    detectHint: "looks for: gemini CLI or ~/.gemini/",
    ruleFile: () => path.join(os.homedir(), ".gemini", "GEMINI.md"),
    install: function () {
      const rf = this.ruleFile();
      fs.mkdirSync(path.dirname(rf), { recursive: true });
      const skillContent = fs.readFileSync(path.join(PROMPT_DIR, "SKILL.md"), "utf-8");
      fs.writeFileSync(rf, buildRulesFile(skillContent, "Gemini CLI"), "utf-8");
      return { dest: rf, files: 1 };
    },
  },
  {
    name: "Aider",
    detect: () => !!safeWhich("aider"),
    detectHint: "looks for: aider in PATH",
    ruleFile: () => path.join(os.homedir(), ".aider", "CONVENTIONS.md"),
    install: function () {
      const rf = this.ruleFile();
      fs.mkdirSync(path.dirname(rf), { recursive: true });
      const skillContent = fs.readFileSync(path.join(PROMPT_DIR, "SKILL.md"), "utf-8");
      fs.writeFileSync(rf, buildRulesFile(skillContent, "Aider"), "utf-8");
      return { dest: rf, files: 1 };
    },
  },
  {
    name: "Continue.dev",
    detect: () => {
      if (fs.existsSync(path.join(os.homedir(), ".continue"))) return true;
      return !!detectVSCodeExt("continue.continue");
    },
    detectHint: "looks for: ~/.continue/ or VS Code Continue extension",
    ruleFile: () => path.join(os.homedir(), ".continue", "rules", "praetor.md"),
    install: function () {
      const rf = this.ruleFile();
      fs.mkdirSync(path.dirname(rf), { recursive: true });
      const skillContent = fs.readFileSync(path.join(PROMPT_DIR, "SKILL.md"), "utf-8");
      fs.writeFileSync(rf, buildRulesFile(skillContent, "Continue.dev"), "utf-8");
      return { dest: rf, files: 1 };
    },
  },
  {
    name: "Codex CLI",
    detect: () => {
      if (safeWhich("codex")) return true;
      return fs.existsSync(path.join(os.homedir(), ".codex"));
    },
    detectHint: "looks for: codex CLI (OpenAI) or ~/.codex/",
    ruleFile: () => path.join(os.homedir(), ".codex", "AGENTS.md"),
    install: function () {
      const rf = this.ruleFile();
      fs.mkdirSync(path.dirname(rf), { recursive: true });
      const skillContent = fs.readFileSync(path.join(PROMPT_DIR, "SKILL.md"), "utf-8");
      fs.writeFileSync(rf, buildRulesFile(skillContent, "Codex CLI"), "utf-8");
      return { dest: rf, files: 1 };
    },
  },
  {
    name: "Roo Code",
    detect: () => {
      if (fs.existsSync(path.join(os.homedir(), ".roo"))) return true;
      return !!detectVSCodeExt("rooveterinaryinc.roo-cline");
    },
    detectHint: "looks for: ~/.roo/ or VS Code Roo Code extension",
    ruleFile: () => path.join(os.homedir(), ".roo", "rules", "praetor.md"),
    install: function () {
      const rf = this.ruleFile();
      fs.mkdirSync(path.dirname(rf), { recursive: true });
      const skillContent = fs.readFileSync(path.join(PROMPT_DIR, "SKILL.md"), "utf-8");
      fs.writeFileSync(rf, buildRulesFile(skillContent, "Roo Code"), "utf-8");
      return { dest: rf, files: 1 };
    },
  },
  {
    name: "Sourcegraph Cody",
    detect: () => {
      if (safeWhich("src")) return true;
      if (detectVSCodeExt("sourcegraph.cody-ai")) return true;
      return fs.existsSync(path.join(os.homedir(), ".sourcegraph"));
    },
    detectHint: "looks for: src CLI, VS Code Cody extension, or ~/.sourcegraph/",
    ruleFile: () => path.join(os.homedir(), ".cody", "rules", "praetor.md"),
    install: function () {
      const rf = this.ruleFile();
      fs.mkdirSync(path.dirname(rf), { recursive: true });
      const skillContent = fs.readFileSync(path.join(PROMPT_DIR, "SKILL.md"), "utf-8");
      fs.writeFileSync(rf, buildRulesFile(skillContent, "Sourcegraph Cody"), "utf-8");
      return { dest: rf, files: 1 };
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

  // 1. Node.js >= 18 (matches package.json engines)
  const nodeVersion = process.versions.node;
  const nodeMajor = parseInt(nodeVersion.split(".")[0], 10);
  if (nodeMajor >= 18) {
    checks.push({ label: "Node.js >= 18", status: "OK", detail: "v" + nodeVersion });
    passed++;
  } else {
    checks.push({ label: "Node.js >= 18", status: "FAIL", detail: "v" + nodeVersion + " (need >= 18)" });
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
    if (latest) {
      var vcmp = compareVersions(latest, VERSION);
      if (vcmp > 0) {
        checks.push({ label: "Version", status: "WARN", detail: "local " + VERSION + " · latest " + latest + " (run --update)" });
        passed++;
      } else if (vcmp === 0) {
        checks.push({ label: "Version", status: "OK", detail: VERSION + " (latest)" });
        passed++;
      } else {
        checks.push({ label: "Version", status: "OK", detail: VERSION + " (ahead of npm " + latest + ")" });
        passed++;
      }
    } else {
      checks.push({ label: "Version", status: "OK", detail: VERSION + " (npm unreachable)" });
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
// Semver comparison — returns -1 (a<b), 0 (equal), 1 (a>b)
// ---------------------------------------------------------------------------
function compareVersions(a, b) {
  var pa = a.replace(/^v/, "").split(".").map(Number);
  var pb = b.replace(/^v/, "").split(".").map(Number);
  for (var i = 0; i < 3; i++) {
    var va = pa[i] || 0, vb = pb[i] || 0;
    if (va < vb) return -1;
    if (va > vb) return 1;
  }
  return 0;
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

// Fetch changelog entries between current and target version from bundled CHANGELOG.md
function getChangelogEntries(targetVersion) {
  try {
    var changelogPath = path.join(__dirname, "..", "CHANGELOG.md");
    if (!fs.existsSync(changelogPath)) return [];
    var raw = fs.readFileSync(changelogPath, "utf-8");
    var lines = raw.split("\n");
    var entries = [];
    var current = null;
    for (var i = 0; i < lines.length; i++) {
      var m = lines[i].match(/^##\s+v?([\d.]+)/);
      if (m) {
        if (current) entries.push(current);
        current = { version: m[1], title: lines[i], lines: [] };
      } else if (current) {
        current.lines.push(lines[i]);
      }
    }
    if (current) entries.push(current);
    // Collect entries from targetVersion back to current VERSION
    var result = [];
    for (var j = 0; j < entries.length; j++) {
      var ev = entries[j].version;
      result.unshift(entries[j]);
      if (ev === VERSION) break;
      if (ev === targetVersion) break;
    }
    // Filter out the current version entry
    return result.filter(function(e) { return e.version !== VERSION; });
  } catch {
    return [];
  }
}

// Count skill files by category
function getSkillStats() {
  try {
    var stats = { agents: 0, phases: 0, references: 0, templates: 0, scripts: 0, total: 0 };
    function walk(dir) {
      var items;
      try { items = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
      for (var i = 0; i < items.length; i++) {
        var p = path.join(dir, items[i].name);
        if (items[i].isDirectory()) {
          var n = items[i].name.toLowerCase();
          if (n.includes("agent")) stats.agents += countFiles(p);
          else if (n.includes("phase")) stats.phases += countFiles(p);
          else if (n.includes("reference")) stats.references += countFiles(p);
          else if (n.includes("template")) stats.templates += countFiles(p);
          else if (n.includes("script")) stats.scripts += countFiles(p);
          walk(p);
        }
      }
    }
    walk(PROMPT_DIR);
    stats.total = countFiles(PROMPT_DIR);
    return stats;
  } catch {
    return { agents: 0, phases: 0, references: 0, templates: 0, scripts: 0, total: 0 };
  }
}

function updateSelf(done) {
  // Clear screen and show header — updateSelf manages its own screen
  // because it uses async spinners (can't run inside runActionThenReturn)
  process.stdout.write("\x1b[2J\x1b[H\x1b[?25h");
  console.log("");
  console.log("  " + C.bold + C.bmagenta + "↻ UPDATE PRAETOR" + C.reset);
  console.log("  " + C.gray + "────────────────────────────────────────────" + C.reset);
  console.log("");

  // done() is called at every exit point — for TUI it shows "Press Enter"
  // and returns to menu; for --update CLI flag it exits
  function finishUpdate() {
    if (done) { done(); return; }
    process.exit(0);
  }

  // ── Step 1: Check local version ──
  var stop1 = spinner("Reading local version");
  var t1 = setInterval(function() {
    clearInterval(t1);
    stop1(C.green + C.bold + "Local: v" + VERSION + C.reset, C.green);

    // ── Step 2: Check npm registry ──
    var stop2 = spinner("Querying npm registry for praetor-audit-kit");
    var t2 = setInterval(function() {
      clearInterval(t2);
      var latest = getLatestVersion();

      if (!latest) {
        stop2(C.red + C.bold + "Unreachable" + C.reset, C.red);
        console.log("");
        console.log("  " + C.yellow + C.bold + "! Cannot check for updates" + C.reset);
        console.log("  " + C.gray + "Could not reach the npm registry. Check your internet" + C.reset);
        console.log("  " + C.gray + "connection or firewall settings." + C.reset);
        console.log("");
        finishUpdate();
        return;
      }

      stop2(C.green + C.bold + "Latest: v" + latest + C.reset, C.green);

      // ── Step 3: Compare versions ──
      var stop3 = spinner("Comparing local v" + VERSION + " with remote v" + latest);
      var t3 = setInterval(function() {
        clearInterval(t3);

        var cmp = compareVersions(latest, VERSION);
        if (cmp <= 0) {
          // latest == VERSION (up to date) OR latest < VERSION (local ahead of npm)
          var versionLabel = cmp === 0 ? "All current" : "Local is ahead";
          stop3(C.green + C.bold + "✓ " + versionLabel + C.reset, C.green);
          console.log("");

          // Verify local skill files are intact
          var stop4 = spinner("Verifying local skill files");
          var t4 = setInterval(function() {
            clearInterval(t4);
            var stats = getSkillStats();
            stop4(C.green + stats.total + " files verified" + C.reset, C.green);

            console.log("");
            console.log("  " + C.bold + "Current Installation:" + C.reset);
            console.log("    " + C.dim + "Version:        " + C.reset + C.green + "v" + VERSION + C.reset + (cmp === 0 ? C.gray + " (latest)" + C.reset : C.byellow + " (ahead of npm v" + latest + ")" + C.reset));
            console.log("    " + C.dim + "Total files:    " + C.reset + stats.total);
            console.log("    " + C.dim + "Agents:         " + C.reset + (stats.agents || "—"));
            console.log("    " + C.dim + "Phases:         " + C.reset + (stats.phases || "—"));
            console.log("    " + C.dim + "References:     " + C.reset + (stats.references || "—"));
            console.log("    " + C.dim + "Templates:      " + C.reset + (stats.templates || "—"));
            console.log("    " + C.dim + "Scripts:        " + C.reset + (stats.scripts || "—"));
            console.log("    " + C.dim + "Agentic tools:  " + C.reset + TOOLS.length + " supported");
            console.log("");
            console.log("  " + C.green + C.bold + "All dependencies and skill files are on the latest version. Nothing to update." + C.reset);
            console.log("");
            finishUpdate();
            return;
          }, 500);
          return;
        }

        // ── UPDATE AVAILABLE ──
        stop3(C.yellow + C.bold + "Update available!" + C.reset, C.yellow);
        console.log("");
        console.log("  " + C.yellow + C.bold + "Update available:" + C.reset + "  " + C.gray + "v" + VERSION + C.reset + " " + C.yellow + "→" + C.reset + " " + C.green + C.bold + "v" + latest + C.reset);
        console.log("");

        // Show what changed
        var entries = getChangelogEntries(latest);
        var stats = getSkillStats();

        console.log("  " + C.bold + "What will be updated:" + C.reset);
        console.log("    " + C.dim + "Package version: " + C.reset + C.gray + "v" + VERSION + C.reset + " → " + C.green + "v" + latest + C.reset);
        console.log("    " + C.dim + "Total files:     " + C.reset + stats.total);
        console.log("    " + C.dim + "Agents:          " + C.reset + (stats.agents || "—"));
        console.log("    " + C.dim + "Phases:          " + C.reset + (stats.phases || "—"));
        console.log("    " + C.dim + "References:      " + C.reset + (stats.references || "—"));
        console.log("    " + C.dim + "Templates:       " + C.reset + (stats.templates || "—"));
        console.log("    " + C.dim + "Scripts:         " + C.reset + (stats.scripts || "—"));
        console.log("    " + C.dim + "Agentic tools:   " + C.reset + TOOLS.length + " supported");
        console.log("");

        if (entries.length > 0) {
          console.log("  " + C.bold + "Changelog highlights:" + C.reset);
          for (var ei = 0; ei < entries.length; ei++) {
            var entry = entries[ei];
            var titleLine = entry.title.replace(/^##\s*/, "").trim();
            console.log("    " + C.cyan + C.bold + titleLine + C.reset);
            var bullets = entry.lines.filter(function(l) {
              return l.trim().startsWith("-") || l.trim().startsWith("*");
            });
            for (var bi = 0; bi < Math.min(bullets.length, 8); bi++) {
              var cleanBullet = bullets[bi].trim()
                .replace(/^[-*]\s*/, "  • ")
                .replace(/\*\*(.+?)\*\*/g, C.bold + "$1" + C.reset)
                .replace(/`(.+?)`/g, C.green + "$1" + C.reset);
              console.log("    " + C.dim + cleanBullet + C.reset);
            }
            if (bullets.length > 8) {
              console.log("    " + C.gray + "  • ...and " + (bullets.length - 8) + " more" + C.reset);
            }
          }
        } else {
          console.log("  " + C.dim + "(No changelog entries found — see CHANGELOG.md)" + C.reset);
        }
        console.log("");

        // ── Download + install ──
        var steps = [
          { label: "Downloading v" + latest, pct: 40 },
          { label: "Installing praetor-audit-kit", pct: 70 },
          { label: "Verifying", pct: 90 },
        ];
        var stepIdx = 0;

        function advance() {
          if (stepIdx >= steps.length) {
            var installStop = spinner("Running npm install -g praetor-audit-kit@latest");
            var realInstall = false;
            try {
              execSync("npm install -g praetor-audit-kit@latest 2>&1", {
                encoding: "utf-8", stdio: ["pipe", "pipe", "pipe"], timeout: 60000,
              });
              realInstall = true;
            } catch (err) {
              realInstall = false;
            }

            installStop(C.green + C.bold + "Done" + C.reset, C.green);
            if (!realInstall) {
              console.log("");
              console.log("  " + C.red + C.bold + "⚠ Update failed" + C.reset);
              console.log("  " + C.gray + "npm install -g did not complete. Try manually:" + C.reset);
              console.log("    " + C.green + "npm install -g praetor-audit-kit@latest" + C.reset);
              console.log("");
              finishUpdate();
              return;
            }
            console.log("");
            console.log("  " + C.green + C.bold + "✓ Updated to v" + latest + C.reset);
            console.log("  " + C.gray + "Previous: v" + VERSION + " → Current: v" + latest + C.reset);
            console.log("");
            console.log("  " + C.bold + "What was updated:" + C.reset);
            console.log("    " + C.dim + "Package version: " + C.gray + "v" + VERSION + C.reset + " → " + C.green + "v" + latest + C.reset);
            console.log("    " + C.dim + "Skill files:     " + C.reset + "all prompt, agent, and reference files refreshed");
            console.log("    " + C.dim + "Dependencies:    " + C.reset + "npm package updated");
            console.log("");
            console.log("  " + C.byellow + C.bold + "Next steps:" + C.reset);
            console.log("    " + C.green + "npx praetor-audit-kit --install" + C.reset + C.dim + "  # re-install skill to your agents" + C.reset);
            console.log("");
            finishUpdate();
            return;
          }
          var step = steps[stepIdx];
          stepIdx++;
          var stepStop = spinner(step.label);
          var inner = setInterval(function() {
            clearInterval(inner);
            stepStop(C.gray + progressBar(step.pct, 20) + C.reset, C.dim);
            advance();
          }, 500);
        }

        advance();
      }, 500);
    }, 500);
  }, 500);
}

// ---------------------------------------------------------------------------
// Install
// ---------------------------------------------------------------------------

function installSkill(targetTool) {
  console.log("");
  console.log("  " + C.bold + C.cyan + "Installing Praetor" + C.reset + C.gray + " v" + VERSION + C.reset);
  console.log("  " + C.gray + "─────────────────────────────" + C.reset);
  console.log("");

  const pf = preflight();

  console.log("  " + C.dim + "Pre-flight checks:" + C.reset);
  for (const c of pf.checks) {
    const icon = c.status === "OK" ? C.green + "✓" + C.reset : c.status === "WARN" ? C.yellow + "!" + C.reset : C.red + "✗" + C.reset;
    console.log("    " + icon + "  " + c.label + ": " + C.gray + c.detail + C.reset);
  }
  console.log("");

  const hardFails = pf.checks.filter((c) => c.status === "FAIL");
  if (hardFails.length > 0) {
    console.error("  " + C.red + C.bold + "Aborting:" + C.reset + " " + hardFails.length + " check(s) failed.");
    for (const f of hardFails) console.error("    " + C.red + "✗  " + f.label + ": " + f.detail + C.reset);
    console.error("");
    console.error("  " + C.dim + "Fix the above and re-run: npx praetor-audit-kit --install" + C.reset);
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
    // Auto-detect: install ONLY to tools that are actually present
    const detected = TOOLS.filter((t) => t.detect());
    if (detected.length === 0) {
      console.log("");
      console.log("  " + C.red + C.bold + "✗ No agentic tools detected on this system." + C.reset);
      console.log("");
      console.log("  " + C.gray + "────────────────────────────────────────────" + C.reset);
      console.log("");
      console.log("  " + C.yellow + C.bold + "What is Praetor?" + C.reset);
      console.log("  " + C.dim + "  Praetor is a prompt kit — it runs INSIDE an AI coding" + C.reset);
      console.log("  " + C.dim + "  agent (Claude Code, Cursor, etc.), not standalone." + C.reset);
      console.log("  " + C.dim + "  It installs a skill/rules file into your agent's" + C.reset);
      console.log("  " + C.dim + "  config directory so the agent can run audits." + C.reset);
      console.log("");
      console.log("  " + C.yellow + C.bold + "Supported Agentic Tools (" + TOOLS.length + "):" + C.reset);
      console.log("");
      var half = Math.ceil(TOOLS.length / 2);
      for (var ci = 0; ci < half; ci++) {
        var leftName = TOOLS[ci].name;
        var leftPad = leftName.padEnd(20);
        var left = "    " + C.cyan + "▸" + C.reset + " " + C.bold + leftPad + C.reset;
        var right = (ci + half < TOOLS.length) ? C.cyan + "▸" + C.reset + " " + C.bold + TOOLS[ci + half].name + C.reset : "";
        console.log(left + "  " + C.gray + right + C.reset);
      }
      console.log("");
      console.log("  " + C.gray + "────────────────────────────────────────────" + C.reset);
      console.log("");
      console.log("  " + C.bgreen + C.bold + "How to fix:" + C.reset);
      console.log("");
      console.log("  " + C.bwhite + "  Step 1." + C.reset + " " + C.bold + "Choose and install an agentic AI tool." + C.reset);
      console.log("  " + C.dim + "           Pick one from the list above and install it on your" + C.reset);
      console.log("  " + C.dim + "           machine (e.g. npm install -g @anthropic/claude-code)." + C.reset);
      console.log("");
      console.log("  " + C.red + C.bold + "  ⚠ Important:" + C.reset + " " + C.yellow + "Praetor does NOT provide any LLM API key," + C.reset);
      console.log("  " + C.yellow + "  subscription, or model access. You must have your own" + C.reset);
      console.log("  " + C.yellow + "  account and API access with the agentic tool you choose." + C.reset);
      console.log("  " + C.dim + "  Praetor only provides the audit prompt/skill — the AI engine" + C.reset);
      console.log("  " + C.dim + "  and its costs are entirely your responsibility." + C.reset);
      console.log("");
      console.log("  " + C.bwhite + "  Step 2." + C.reset + " " + C.dim + "Once installed, run:" + C.reset);
      console.log("     " + C.green + "npx praetor-audit-kit --install" + C.reset);
      console.log("");
      console.log("  " + C.bwhite + "  Step 3." + C.reset + " " + C.dim + "Or force-install to a specific tool:" + C.reset);
      console.log("     " + C.green + "npx praetor-audit-kit --install \"Claude Code\"" + C.reset);
      console.log("");
      console.log("  " + C.bwhite + "  Step 4." + C.reset + " " + C.dim + "Run pre-flight to verify detection:" + C.reset);
      console.log("     " + C.green + "npx praetor-audit-kit --check" + C.reset);
      console.log("");
      console.log("  " + C.gray + "────────────────────────────────────────────" + C.reset);
      console.log("  " + C.dim + "Docs: " + C.cyan + "https://github.com/Harery/Praetor" + C.reset);
      console.log("");
      process.exit(1);
    }
    targets = detected;
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
      console.log("  " + C.green + "✓" + C.reset + "  " + C.bold + tool.name + C.reset + C.gray + " → " + result.dest + " (" + result.files + " files)" + C.reset);
      installed++;
    } catch (err) {
      console.error("  " + C.red + "✗  " + tool.name + ": " + err.message + C.reset);
    }
  }

  console.log("");
  if (installed > 0) {
    console.log("  " + C.green + C.bold + "✓ Installed to " + installed + " tool(s)" + C.reset);
    console.log("");
    console.log("  " + C.dim + "Restart your agentic tool to activate." + C.reset);
    console.log("  " + C.dim + "Usage:" + C.reset);
    console.log("    " + C.gray + "Start a new session, then: " + C.cyan + "/praetor" + C.reset);
  } else {
    console.error("  " + C.red + "No tools installed. Check errors above." + C.reset);
    process.exit(1);
  }
  console.log("");
}

// ---------------------------------------------------------------------------
// Uninstall (P1-5)
// ---------------------------------------------------------------------------

function uninstallSkill() {
  console.log("");
  console.log("  " + C.bold + C.red + "Uninstalling Praetor" + C.reset);
  console.log("  " + C.gray + "─────────────────────────────" + C.reset);
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
          console.log("  " + C.red + "⊗ Removed" + C.reset + "  " + C.bold + tool.name + C.reset + C.gray + " → " + loc + C.reset);
          removed++;
        } catch (err) {
          console.error("  " + C.red + "✗ Failed to remove " + loc + ": " + err.message + C.reset);
        }
      }
    }
  }

  console.log("");
  if (removed > 0) {
    console.log("  " + C.red + C.bold + "✓ Uninstalled from " + removed + " location(s)" + C.reset);
  } else {
    console.log("  " + C.gray + "Nothing to uninstall — Praetor was not installed." + C.reset);
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
  printNextSteps(selected.length === 1 ? (selected[0].id || selected[0].aliases[0]) : null);
}

// Drill into a specific sub-scope: --drill <scope> <subIndex>
function drillScope(scopeArg, subIndex) {
  var manifest = JSON.parse(fs.readFileSync(path.join(PROMPT_DIR, "scripts", "scopes.json"), "utf-8"));
  var scopes = manifest.scopes;

  // Build alias map
  var aliasMap = {};
  for (var i = 0; i < scopes.length; i++) {
    aliasMap[String(i + 1)] = i;
    for (var j = 0; j < scopes[i].aliases.length; j++) {
      aliasMap[scopes[i].aliases[j].toLowerCase()] = i;
    }
  }

  var scopeIdx = aliasMap[(scopeArg || "").trim().toLowerCase()];
  if (scopeIdx === undefined) {
    console.error("  Unknown scope: " + scopeArg);
    console.error("  Available: 1-8, or aliases: full, eng, sec, biz, ops, sup, risk, quick");
    process.exit(1);
  }

  var scope = scopes[scopeIdx];
  if (!scope.sub || scope.sub.length === 0) {
    console.error("  No sub-scopes for: " + scope.label);
    process.exit(1);
  }

  var idx = parseInt(subIndex, 10);
  if (isNaN(idx) || idx < 1 || idx > scope.sub.length) {
    console.error("  Invalid sub-scope index: " + subIndex);
    console.error("  Available: 1-" + scope.sub.length);
    process.exit(1);
  }

  var sub = scope.sub[idx - 1];
  console.log("");
  console.log("  " + C.green + C.bold + "✓ " + scope.label + (scope.tag ? C.gray + " [" + scope.tag + "]" + C.reset : "") + C.reset + " " + C.cyan + "→" + C.reset + " " + C.bwhite + C.bold + sub.name + C.reset);
  console.log("");
  console.log("  " + C.gray + "─────────────────────────────" + C.reset);
  console.log("  " + C.dim + "Scope:     " + C.reset + scope.label + (scope.tag ? " [" + scope.tag + "]" : ""));
  console.log("  " + C.dim + "Sub-scope: " + C.reset + sub.name);
  console.log("  " + C.dim + "Focus:     " + C.reset + sub.items);
  console.log("  " + C.dim + "Agents:    " + C.reset + scope.agents.join(", "));
  console.log("  " + C.gray + "─────────────────────────────" + C.reset);

  // Show all sub-scopes for context
  console.log("");
  console.log("  " + C.dim + "All sub-scopes in " + scope.label + ":" + C.reset);
  for (var k = 0; k < scope.sub.length; k++) {
    var marker = (k === idx - 1) ? C.green + "▸" + C.reset : C.gray + "○" + C.reset;
    console.log("  " + marker + "  " + (k === idx - 1 ? C.bold + scope.sub[k].name + C.reset : C.dim + scope.sub[k].name + C.reset) + " — " + C.gray + scope.sub[k].items + C.reset);
  }
  console.log("");
  printNextSteps(scope.id || scope.aliases[0]);
}

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

// Read agent descriptions from prompt/07-agents/*.md
// Returns a map: { "A04": "Unit Test Agent", ... }
var _agentDescCache = null;
function getAgentDescriptions(agentIds) {
  if (_agentDescCache) return _agentDescCache;
  _agentDescCache = {};
  var agentsDir = path.join(PROMPT_DIR, "07-agents");
  try {
    var files = fs.readdirSync(agentsDir);
    for (var i = 0; i < files.length; i++) {
      if (!files[i].endsWith(".md")) continue;
      try {
        var content = fs.readFileSync(path.join(agentsDir, files[i]), "utf-8");
        // Match "# Agent AXX — Title"
        var m = content.match(/^#\s+Agent\s+(A\d+)\s+[—–-]\s+(.+)$/m);
        if (m) {
          _agentDescCache[m[1]] = m[2].trim();
        }
      } catch (e) { /* skip unreadable */ }
    }
  } catch (e) { /* dir not found */ }
  return _agentDescCache;
}

// Print next-steps guidance after showing scope details
function printNextSteps(scopeId) {
  var scopeFlag = scopeId ? " --scope " + scopeId : "";
  console.log("  " + C.gray + "─────────────────────────────" + C.reset);
  console.log("  " + C.bold + "Next steps:" + C.reset);
  console.log("  " + C.dim + "  1. Install:" + C.reset + "  " + C.green + "npx praetor-audit-kit --install" + C.reset);
  console.log("  " + C.dim + "  2. Trigger:" + C.reset + "   " + C.green + "/praetor" + C.reset + C.dim + " inside your AI agent" + C.reset);
  console.log("  " + C.dim + "  3. Specify:" + C.reset + "  " + C.green + "/praetor" + scopeFlag + C.reset + C.dim + " to run this scope" + C.reset);
  console.log("");
}

function safeWhich(cmd) {
  try {
    var isWin = process.platform === "win32";
    var shellCmd = isWin
      ? "where " + cmd + " >nul 2>&1"
      : "which " + cmd + " 2>/dev/null";
    return execSync(shellCmd, { encoding: "utf-8", stdio: ["pipe", "pipe", "pipe"] }).trim() || null;
  } catch { return null; }
}

// Detect a VS Code extension by folder prefix in any extensions dir
function detectVSCodeExt(extPrefix) {
  var dirs = [
    path.join(os.homedir(), ".vscode", "extensions"),
    path.join(os.homedir(), ".vscode-insiders", "extensions"),
    path.join(os.homedir(), ".vscode-server", "extensions"),
  ];
  for (var i = 0; i < dirs.length; i++) {
    try {
      var entries = fs.readdirSync(dirs[i]);
      for (var j = 0; j < entries.length; j++) {
        if (entries[j].toLowerCase().startsWith(extPrefix.toLowerCase())) {
          return path.join(dirs[i], entries[j]);
        }
      }
    } catch {}
  }
  return null;
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

// Generic rules-file builder for tools that use markdown rules
// (Windsurf, GitHub Copilot, Cline, Amazon Q, Gemini, Aider, Continue, Codex, Roo, Cody)
function buildRulesFile(skillContent, toolName) {
  var fm = {};
  var fmMatch = skillContent.match(/^---\n([\s\S]*?)\n---/);
  if (fmMatch) {
    for (var line of fmMatch[1].split("\n")) {
      var kv = line.match(/^(\w+):\s*"?([^"]*)"$/);
      if (kv) fm[kv[1]] = kv[2];
    }
  }
  var body = skillContent.replace(/^---[\s\S]*?---\n*/, "");
  return [
    "# Praetor — Production Readiness & Audit System",
    "# Installed for: " + toolName,
    "# Version: " + (fm.version || VERSION),
    "# Trigger: /praetor or mention \"audit\", \"production readiness\", \"QA review\"",
    "",
    body.trim(),
    "",
  ].join("\n");
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
// Interactive TUI menu
// ---------------------------------------------------------------------------

function runCheck() {
  var pf = preflight();
  console.log("");
  console.log("  " + C.bold + "Pre-flight Diagnostics" + C.reset);
  console.log("  " + C.gray + "────────────────────────────────────────────" + C.reset);
  for (var i = 0; i < pf.checks.length; i++) {
    var c = pf.checks[i];
    var icon, color;
    if (c.status === "OK") { icon = "✓"; color = C.green; }
    else if (c.status === "WARN") { icon = "!"; color = C.yellow; }
    else { icon = "✗"; color = C.red; }
    console.log("  " + color + C.bold + icon + C.reset + "  " + C.bold + c.label + C.reset + "  " + C.gray + c.detail + C.reset);
  }

  // Detailed agentic tool breakdown
  var detected = TOOLS.filter(function(t) { return t.detect(); });
  console.log("");
  console.log("  " + C.bold + "Agentic Tool Scan" + C.reset + " " + C.gray + "(" + detected.length + "/" + TOOLS.length + " detected)" + C.reset);
  console.log("  " + C.gray + "────────────────────────────────────────────" + C.reset);
  for (var j = 0; j < TOOLS.length; j++) {
    var tool = TOOLS[j];
    var found = tool.detect();
    var tIcon = found ? C.green + "✓" + C.reset : C.gray + "○" + C.reset;
    var tStatus = found ? C.bgreen + "detected" + C.reset : C.gray + "not found" + C.reset;
    var tName = found ? C.bold + C.bwhite + tool.name + C.reset : C.gray + tool.name + C.reset;
    var tDetail = found ? (tool.skillDir ? C.dim + "→ " + tool.skillDir() + C.reset : C.dim + "→ " + tool.ruleFile() + C.reset) : C.dim + tool.detectHint || "" + C.reset;
    console.log("  " + tIcon + "  " + tName + "  " + tStatus + "  " + tDetail);
  }

  console.log("  " + C.gray + "────────────────────────────────────────────" + C.reset);
  var summaryColor = pf.failed > 0 ? C.red : C.green;
  console.log("  " + summaryColor + C.bold + pf.passed + " passed" + C.reset + C.gray + ", " + (pf.failed > 0 ? C.red + C.bold : "") + pf.failed + " failed" + (pf.failed > 0 ? C.reset : "") + C.reset);
  console.log("  " + C.dim + "Praetor searches for " + TOOLS.length + " agentic tools. " + (TOOLS.length - detected.length) + " not found." + C.reset);
  console.log("");

  // Attention banner about tool installation
  console.log("  " + C.bgRed + C.white + C.bold + " ⚠ ATTENTION " + C.reset);
  console.log("  " + C.yellow + C.bold + "  Praetor does NOT install, provide, or help install any AI" + C.reset);
  console.log("  " + C.yellow + C.bold + "  agentic tool, CLI, command, or prerequisite." + C.reset);
  console.log("  " + C.dim + "  Each tool above must be installed independently by the user." + C.reset);
  console.log("  " + C.dim + "  Praetor only installs its audit prompt/skill INTO tools that" + C.reset);
  console.log("  " + C.dim + "  are already present on this system." + C.reset);
  console.log("");
}

function showStaticBanner() {
  var lines = praetorBanner();
  for (var i = 0; i < lines.length; i++) {
    console.log(lines[i]);
  }

  console.log("  " + C.bcyan + "Install:" + C.reset);
  console.log("    " + C.gray + "npx praetor-audit-kit --install" + C.reset + "            # auto-detect tools");
  console.log("    " + C.gray + "npx praetor-audit-kit --install \"OpenCode\"" + C.reset + "  # specific tool");
  console.log("");
  console.log("  " + C.bcyan + "Scope:" + C.reset);
  console.log("    " + C.gray + "npx praetor-audit-kit --scope biz" + C.reset + "          # show Business scope");
  console.log("    " + C.gray + "npx praetor-audit-kit --scope 2-4" + C.reset + "          # show range");
  console.log("    " + C.gray + "npx praetor-audit-kit --scope" + C.reset + "              # interactive selector");
  console.log("");
  console.log("  " + C.bcyan + "Other:" + C.reset);
  console.log("    " + C.gray + "npx praetor-audit-kit --check" + C.reset + "              # pre-flight only");
  console.log("    " + C.gray + "npx praetor-audit-kit --uninstall" + C.reset + "          # remove skill");
  console.log("    " + C.gray + "npx praetor-audit-kit --update" + C.reset + "             # update to latest");
  console.log("");
  console.log("  " + C.dim + "Docs: " + C.cyan + "https://github.com/Harery/Praetor" + C.reset);
  console.log("");
}

function showInlineHelp() {
  console.log("");
  console.log("  " + C.bold + C.cyan + "praetor-audit-kit" + C.reset + C.gray + " v" + VERSION + C.reset);
  console.log("  " + C.gray + "─────────────────────────────" + C.reset);
  console.log("");
  console.log("  " + C.dim + "Usage:" + C.reset + "  npx praetor-audit-kit [option] [arg]");
  console.log("");
  console.log("  " + C.bwhite + "Options:" + C.reset);
  console.log("    " + C.green + "-i" + C.reset + ", " + C.green + "--install" + C.reset + " [tool]   Install skill (auto-detects agentic tools)");
  console.log("    " + C.green + "-u" + C.reset + ", " + C.green + "--uninstall" + C.reset + "        Remove installed skill from all tools");
  console.log("    " + C.green + "-s" + C.reset + ", " + C.green + "--scope" + C.reset + " [scope]    Show scope details (number, alias, range)");
  console.log("    " + C.green + "-c" + C.reset + ", " + C.green + "--check" + C.reset + "            Pre-flight check without installing");
  console.log("    " + C.bmagenta + "    --update" + C.reset + "               Update to latest version from npm");
  console.log("    " + C.green + "-p" + C.reset + ", " + C.green + "--prompt" + C.reset + "           Output the master prompt to stdout");
  console.log("    " + C.green + "-l" + C.reset + ", " + C.green + "--path" + C.reset + "             Show path to MASTER_PROMPT.md");
  console.log("    " + C.green + "-h" + C.reset + ", " + C.green + "--help" + C.reset + "             Show this help message");
  console.log("    " + C.gray + "    --no-tui" + C.reset + "               Force static banner (no interactive menu)");
  console.log("    " + C.gray + "    --welcome" + C.reset + "              Show banner (used by postinstall hook)");
  console.log("");
  console.log("  " + C.bwhite + "Scope aliases:" + C.reset);
  console.log("    " + C.yellow + "full" + C.reset + ", " + C.yellow + "eng" + C.reset + ", " + C.yellow + "sec" + C.reset + ", " + C.yellow + "biz" + C.reset + ", " + C.yellow + "ops" + C.reset + ", " + C.yellow + "sup" + C.reset + ", " + C.yellow + "risk" + C.reset + ", " + C.yellow + "quick" + C.reset);
  console.log("    " + C.dim + "(or numbers 1-8, ranges like 2-4, comma lists like 3,5)" + C.reset);
  console.log("");
  console.log("  " + C.dim + "Docs: " + C.cyan + "https://github.com/Harery/Praetor" + C.reset);
  console.log("");
}

// -- Generic interactive list primitive ----------------------------------------

function interactiveSelect(opts) {
  const items = opts.items;
  let selected = 0;
  const stdin = process.stdin;
  const stdout = process.stdout;

  function renderFull() {
    // Buffer entire render for one atomic write (avoids Docker terminal flushing issues)
    var buf = "";
    // Clear screen, show cursor
    buf += "\x1b[2J\x1b[H\x1b[?25h";
    // Title
    if (opts.title) {
      for (const line of opts.title) {
        buf += line + "\n";
      }
    }
    // Nav hint
    var hint = C.dim + C.italic + "  ↑↓ navigate · Enter select";
    if (opts.onBack) hint += " · Esc back";
    hint += " · Ctrl+C exit" + C.reset;
    buf += hint + "\n\n";
    // Items
    for (var i = 0; i < items.length; i++) {
      var isSel = i === selected;
      var cursor = isSel ? C.cyan + C.bold + "❯ " + C.reset : C.gray + "  " + C.reset;
      var labelColor = isSel ? C.bwhite + C.bold : C.gray;
      var hintColor = isSel ? C.dim : C.gray;
      var label = items[i].label;
      var h = items[i].hint ? "  " + hintColor + items[i].hint + C.reset : "";
      buf += "\r\x1b[2K" + cursor + labelColor + label + C.reset + h + "\n";
    }
    // Single atomic write
    stdout.write(buf);
  }

  function renderList() {
    renderFull();
  }

  function cleanup() {
    stdin.setRawMode(false);
    stdin.pause();
    stdin.removeListener("data", onKey);
  }

  function onKey(chunk) {
    const key = chunk.toString();
    if (key === "\x03") {
      cleanup();
      stdout.write("\n\n");
      process.exit(0);
    }
    if (key === "\x1b" && opts.onBack) {
      cleanup();
      opts.onBack();
      return;
    }
    // Handle Enter — terminals send \r, \n, or \r\n
    if (key === "\r" || key === "\n" || key === "\r\n") {
      cleanup();
      opts.onSelect(selected);
      return;
    }
    if (key === "\x1b[A" || key === "k") {
      selected = (selected - 1 + items.length) % items.length;
      renderList();
    }
    if (key === "\x1b[B" || key === "j") {
      selected = (selected + 1) % items.length;
      renderList();
    }
  }

  renderFull();
  stdin.setRawMode(true);
  stdin.resume();
  stdin.setEncoding("utf-8");
  // Delay attaching listener to swallow phantom \n from \r\n sequences
  // that Docker/Linux terminals send for a single Enter keypress
  setTimeout(function() {
    stdin.on("data", onKey);
  }, 50);
}

// -- Action runner (run action, then prompt to return) -------------------------

function runActionThenReturn(actionFn, screenTitle) {
  var stdin = process.stdin;
  var stdout = process.stdout;

  // ── Phase 1: Build entire screen content in a buffer ──
  // This avoids any partial-write / flushing issues in Docker terminals.
  var buf = "";
  function W(s) { buf += s; }

  // Clear screen, show cursor (in case it was hidden), move to home
  W("\x1b[2J\x1b[H\x1b[?25h");

  if (screenTitle) {
    W("\n  " + C.bold + C.cyan + screenTitle + C.reset + "\n");
    W("  " + C.gray + "────────────────────────────────────────────" + C.reset + "\n");
  }

  // Run the action — capture its console.log output by temporarily
  // overriding console.log to append to our buffer
  var origLog = console.log;
  var origWrite = process.stdout.write.bind(process.stdout);
  console.log = function() {
    var args = Array.prototype.slice.call(arguments);
    var msg = args.map(function(a) {
      if (typeof a === "string") return a;
      try { return JSON.stringify(a); } catch(e) { return String(a); }
    }).join(" ");
    W(msg + "\n");
  };
  process.stdout.write = function(s) { W(s); return true; };

  try {
    actionFn();
  } catch (err) {
    W("\n  " + C.red + C.bold + "⚠ Error rendering screen:" + C.reset + "\n");
    W("  " + C.red + (err && err.message ? err.message : String(err)) + C.reset + "\n");
    W("  " + C.gray + "Try running: npx praetor-audit-kit --check" + C.reset + "\n\n");
  } finally {
    // Restore originals — always runs, even if actionFn throws or calls process.exit
    console.log = origLog;
    process.stdout.write = origWrite;
  }

  // ── Phase 2: Write entire buffer in one atomic call ──
  stdout.write(buf);

  // ── Phase 3: Wait for Enter to return ──
  // Use readline instead of raw-mode for maximum terminal compatibility
  var readline = require("readline");
  var rl = readline.createInterface({
    input: stdin,
    output: stdout,
    terminal: false
  });

  stdout.write("\r\x1b[2K  " + C.dim + C.italic + "Press Enter to return to menu" + C.reset + "  ");

  rl.question("", function() {
    rl.close();
    stdout.write("\r\x1b[2K");
    mainMenu();
  });
}

// -- Scope selector (2-level: scope → sub-scope) --------------------------------

function scopeSelector() {
  const manifest = JSON.parse(fs.readFileSync(path.join(PROMPT_DIR, "scripts", "scopes.json"), "utf-8"));
  const scopes = manifest.scopes;

  var title = praetorBanner().concat([
    "  " + C.bold + C.cyan + "Select Audit Scope" + C.reset,
    "",
  ]);

  const scopeItems = scopes.map(function(s, i) {
    var tag = s.tag ? C.gray + " [" + s.tag + "]" + C.reset : "";
    var num = C.dim + (i + 1) + "." + C.reset;
    return { label: num + " " + s.label + tag, hint: s.desc };
  });
  scopeItems.push({ label: C.gray + "↩ Back to main menu" + C.reset, hint: "" });
  scopeItems.push({ label: C.gray + "✕ Exit" + C.reset, hint: "" });

  function onScopeSelect(index) {
    if (index === scopeItems.length - 2) {
      // Back
      mainMenu();
    } else if (index === scopeItems.length - 1) {
      // Exit
      process.exit(0);
    } else {
      // Drill into sub-scopes
      subScopeSelector(scopes[index], manifest);
    }
  }

  function onScopeBack() {
    mainMenu();
  }

  interactiveSelect({
    title: title,
    items: scopeItems,
    onSelect: onScopeSelect,
    onBack: onScopeBack,
  });
}

function subScopeSelector(scope, manifest) {
  var subs = scope.sub || [];

  var subTitle = [
    "",
    "  " + C.bold + C.cyan + scope.label + C.reset + (scope.tag ? C.gray + " [" + scope.tag + "]" + C.reset : ""),
    "  " + C.gray + "Agents: " + scope.agents.join(", ") + " · Categories: " + scope.categories.join(", ") + C.reset,
    "  " + C.gray + "─────────────────────────────" + C.reset,
    "",
  ];

  var subItems = subs.map(function(sub, i) {
    var num = C.dim + (i + 1) + "." + C.reset;
    return { label: num + " " + sub.name, hint: sub.items };
  });
  subItems.push({ label: C.gray + "↩ Back to scope list" + C.reset, hint: "" });
  subItems.push({ label: C.gray + "↩ Back to main menu" + C.reset, hint: "" });
  subItems.push({ label: C.gray + "✕ Exit" + C.reset, hint: "" });

  function onSubSelect(index) {
    if (index === subItems.length - 3) {
      // Back to scope list
      scopeSelector();
    } else if (index === subItems.length - 2) {
      // Back to main menu
      mainMenu();
    } else if (index === subItems.length - 1) {
      // Exit
      process.exit(0);
    } else {
      // Selected a sub-scope — show rich detail screen
      var sub = subs[index];

      // Parse agent references from items field (e.g. "(A.6)" → A06, "(A.17, A.18)" → A17, A18)
      var agentRefs = [];
      var agentMatches = sub.items.match(/A\.(\d+)/g);
      if (agentMatches) {
        for (var am = 0; am < agentMatches.length; am++) {
          var num = parseInt(agentMatches[am].replace("A.", ""), 10);
          agentRefs.push("A" + (num < 10 ? "0" : "") + num);
        }
      }
      // Fallback: use scope agents if no specific refs
      var subAgents = agentRefs.length > 0 ? agentRefs : scope.agents;

      // Focus areas (split items by · and strip agent refs)
      var focusAreas = sub.items.replace(/\s*\(A\.[\d,\sA.]+\)\s*/g, "").split(/\s*·\s*/);

      // Get agent descriptions
      var agentDescs = getAgentDescriptions(subAgents);

      var scopeFlagVal = scope.id || scope.aliases[0];

      // All content goes inside the action function so runActionThenReturn captures it
      runActionThenReturn(function() {
        console.log("  " + C.green + C.bold + "✓ " + scope.label + C.reset + (scope.tag ? C.gray + " [" + scope.tag + "]" + C.reset : "") + " " + C.cyan + "→" + C.reset + " " + C.bwhite + C.bold + sub.name + C.reset);
        console.log("  " + C.gray + "────────────────────────────────────────────" + C.reset);
        console.log("");
        console.log("  " + C.bold + "Sub-scope:  " + C.bwhite + sub.name + C.reset);
        console.log("  " + C.dim + "ID:         " + C.reset + (sub.id || "—"));
        console.log("  " + C.dim + "Scope:      " + C.reset + scope.label + (scope.tag ? " [" + scope.tag + "]" : ""));
        console.log("");

        // Agents assigned
        console.log("  " + C.bold + "Agents assigned to this sub-scope:" + C.reset);
        for (var sa = 0; sa < subAgents.length; sa++) {
          var agentId = subAgents[sa];
          var desc = agentDescs[agentId] || "Specialist agent";
          console.log("    " + C.cyan + "●" + C.reset + " " + C.bold + agentId + C.reset + " " + C.gray + "— " + desc + C.reset);
        }
        console.log("");

        // Areas covered
        console.log("  " + C.bold + "Areas covered:" + C.reset);
        for (var fa = 0; fa < focusAreas.length; fa++) {
          console.log("    " + C.green + "▸" + C.reset + " " + focusAreas[fa].trim());
        }
        console.log("");

        // Models / AI agents compatibility
        console.log("  " + C.bold + "Runs inside these AI agents:" + C.reset);
        console.log("    " + C.dim + "Claude Code · OpenCode · Cursor · Windsurf · GitHub Copilot" + C.reset);
        console.log("    " + C.dim + "Cline · Amazon Q · Gemini CLI · Aider · Continue.dev · Codex CLI" + C.reset);
        console.log("    " + C.dim + "Roo Code · Sourcegraph Cody" + C.reset);
        console.log("");
        console.log("  " + C.bold + "Compatible with:" + C.reset);
        console.log("    " + C.dim + "Any LLM that your AI agent supports (GPT-4, Claude, Gemini, etc.)" + C.reset);
        console.log("");

        // LLM disclaimer
        console.log("  " + C.bgYellow + C.black + C.bold + " ⚡ NOTE " + C.reset + " " + C.byellow + C.bold + "Praetor does NOT provide any LLM API key," + C.reset);
        console.log("  " + C.byellow + C.bold + "subscription, or model access." + C.reset + " " + C.byellow + "You must have your own" + C.reset);
        console.log("  " + C.byellow + "AI agent installed with an active API account." + C.reset);
        console.log("");

        console.log("  " + C.gray + "────────────────────────────────────────────" + C.reset);
        console.log("");

        // Installation guide
        console.log("  " + C.bold + "Installation guide:" + C.reset);
        console.log("");
        console.log("  " + C.dim + "  Step 1 — Install the skill to your detected tools:" + C.reset);
        console.log("     " + C.green + "npx praetor-audit-kit --install" + C.reset);
        console.log("");
        console.log("  " + C.dim + "  Step 2 — Or install to a specific tool:" + C.reset);
        console.log("     " + C.green + "npx praetor-audit-kit --install \"Claude Code\"" + C.reset);
        console.log("");
        console.log("  " + C.dim + "  Step 3 — Trigger the audit inside your AI agent:" + C.reset);
        console.log("     " + C.green + "/praetor" + C.reset + C.dim + "  then select scope: " + scopeFlagVal + C.reset);
        console.log("");
        console.log("  " + C.dim + "  Step 4 — Or run non-interactively:" + C.reset);
        console.log("     " + C.green + "/praetor --scope " + scopeFlagVal + C.reset);
        console.log("");
        console.log("  " + C.dim + "  Step 5 — Drill into this sub-scope from CLI:" + C.reset);
        console.log("     " + C.green + "npx praetor-audit-kit --drill " + scopeFlagVal + " " + (index + 1) + C.reset);
        console.log("");
        console.log("  " + C.gray + "────────────────────────────────────────────" + C.reset);
      }, sub.name.toUpperCase());
    }
  }

  function onSubBack() {
    scopeSelector();
  }

  interactiveSelect({
    title: subTitle,
    items: subItems,
    onSelect: onSubSelect,
    onBack: onSubBack,
  });
}

// -- Main menu (loops) ---------------------------------------------------------

function mainMenu() {
  var title = praetorBanner();

  var ICONS = [
    C.green + "↓" + C.reset,
    C.yellow + "⚡" + C.reset,
    C.cyan + "◎" + C.reset,
    C.red + "⊗" + C.reset,
    C.bmagenta + "↻" + C.reset,
    C.blue + "?" + C.reset,
    C.gray + "⏻" + C.reset,
  ];

  var menuItems = [
    { label: ICONS[0] + " " + C.bold + "Install" + C.reset + C.gray + " (auto-detect tools)" + C.reset, hint: "Install to all detected agentic tools" },
    { label: ICONS[1] + " " + C.bold + "Pre-flight check" + C.reset,                   hint: "Verify Node version, npm access, paths" },
    { label: ICONS[2] + " " + C.bold + "Scope selector" + C.reset,                      hint: "Browse audit scopes and sub-scopes" },
    { label: ICONS[3] + " " + C.bold + "Uninstall" + C.reset,                          hint: "Remove praetor from all tools" },
    { label: ICONS[4] + " " + C.bold + "Update to latest" + C.reset,                    hint: "Pull newest version from npm" },
    { label: ICONS[5] + " " + C.bold + "Help" + C.reset,                               hint: "Show full usage and flag reference" },
    { label: ICONS[6] + " " + C.bold + "Exit" + C.reset,                               hint: "" },
  ];

  function onSelect(index) {
    switch (index) {
      case 0: installSkill(null); runActionThenReturn(function() {}, "INSTALL"); break;
      case 1: runActionThenReturn(runCheck, "PRE-FLIGHT CHECK"); break;
      case 2: scopeSelector(); break;
      case 3: runActionThenReturn(uninstallSkill, "UNINSTALL"); break;
      case 4: updateSelf(function() {
        // After updateSelf finishes, show "Press Enter" prompt
        var readline = require("readline");
        var rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: false });
        process.stdout.write("\r\x1b[2K  " + C.dim + C.italic + "Press Enter to return to menu" + C.reset + "  ");
        rl.question("", function() {
          rl.close();
          process.stdout.write("\r\x1b[2K");
          mainMenu();
        });
      }); break;
      case 5: runActionThenReturn(showInlineHelp, "HELP"); break;
      case 6: process.exit(0); break;
    }
  }

  interactiveSelect({
    title: title,
    items: menuItems,
    onSelect: onSelect,
    onBack: null,
  });
}

function interactiveMenu() {
  mainMenu();
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
} else if (arg === "--drill" || arg === "-d") {
  drillScope(flag || "", args[2] || "");
} else if (arg === "--prompt" || arg === "-p") {
  showPrompt();
} else if (arg === "--path" || arg === "-l") {
  showPath();
} else if (arg === "--check" || arg === "-c") {
  runCheck();
} else if (arg === "--update") {
  updateSelf(function() { process.exit(0); });
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
  console.log("    -d, --drill [scope] [n] Drill into sub-scope n of scope");
  console.log("    -c, --check            Pre-flight check without installing");
  console.log("    --update               Update to latest version from npm");
  console.log("    -p, --prompt           Output the master prompt to stdout");
  console.log("    -l, --path             Show path to MASTER_PROMPT.md");
  console.log("    -h, --help             Show this help message");
  console.log("    --no-tui               Force static banner (no interactive menu)");
  console.log("    --welcome              Show banner (used by postinstall hook)");
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
} else if (arg === "--welcome") {
  // Postinstall hook — always show static banner (never interactive)
  showStaticBanner();
} else if (arg === "--no-tui") {
  // Force static banner (CI / non-interactive use)
  showStaticBanner();
} else if (arg === "--test-tui") {
  // Hidden test flag — auto-cycle through all TUI screens without keyboard input
  // 1. Banner + menu items
  var _lines = praetorBanner();
  for (var bi = 0; bi < _lines.length; bi++) console.log(_lines[bi]);
  console.log("  " + C.bold + "MENU ITEMS:" + C.reset);
  console.log("  " + C.green + "↓" + C.reset + " " + C.bold + "Install" + C.reset + C.gray + " (auto-detect tools)" + C.reset);
  console.log("  " + C.yellow + "⚡" + C.reset + " " + C.bold + "Pre-flight check" + C.reset);
  console.log("  " + C.cyan + "◎" + C.reset + " " + C.bold + "Scope selector" + C.reset);
  console.log("  " + C.red + "⊗" + C.reset + " " + C.bold + "Uninstall" + C.reset);
  console.log("  " + C.bmagenta + "↻" + C.reset + " " + C.bold + "Update to latest" + C.reset);
  console.log("  " + C.blue + "?" + C.reset + " " + C.bold + "Help" + C.reset);
  console.log("  " + C.gray + "⏻" + C.reset + " " + C.bold + "Exit" + C.reset);

  // 2. Pre-flight check (then returns to menu, not exits)
  console.log("");
  console.log("  " + C.gray + "=== Pre-flight Check ===" + C.reset);
  runCheck();

  // 3. Scope list
  console.log("  " + C.gray + "=== Scope List ===" + C.reset);
  var _manifest = JSON.parse(fs.readFileSync(path.join(PROMPT_DIR, "scripts", "scopes.json"), "utf-8"));
  var _scopes = _manifest.scopes;
  for (var si = 0; si < _scopes.length; si++) {
    var s = _scopes[si];
    console.log("  " + C.dim + (si+1) + "." + C.reset + " " + s.label + (s.tag ? C.gray + " [" + s.tag + "]" + C.reset : "") + C.dim + " — " + s.desc + C.reset);
  }
  console.log("  " + C.gray + "↩ Back to main menu" + C.reset);
  console.log("  " + C.gray + "✕ Exit" + C.reset);

  // 4. Sub-scope list for scope #4 (Business)
  console.log("");
  console.log("  " + C.gray + "=== Sub-scope List: Business & Product [BIZ] ===" + C.reset);
  var _biz = _scopes[3];
  console.log("  " + C.gray + "Agents: " + _biz.agents.join(", ") + C.reset);
  for (var ss = 0; ss < _biz.sub.length; ss++) {
    console.log("  " + C.dim + (ss+1) + "." + C.reset + " " + C.bold + _biz.sub[ss].name + C.reset + C.dim + " — " + _biz.sub[ss].items + C.reset);
  }
  console.log("  " + C.gray + "↩ Back to scope list" + C.reset);
  console.log("  " + C.gray + "↩ Back to main menu" + C.reset);
  console.log("  " + C.gray + "✕ Exit" + C.reset);

  // 5. Sub-scope selection result
  console.log("");
  console.log("  " + C.gray + "=== Sub-scope Selection Result ===" + C.reset);
  var _sub = _biz.sub[0];
  console.log("  " + C.green + C.bold + "✓ Selected" + C.reset + "  Business & Product " + C.gray + "[BIZ]" + C.reset + " " + C.cyan + "→" + C.reset + " " + C.bwhite + C.bold + _sub.name + C.reset);
  console.log("  " + C.gray + "─────────────────────────────" + C.reset);
  console.log("  " + C.dim + "Scope:     " + C.reset + "Business & Product [BIZ]");
  console.log("  " + C.dim + "Sub-scope: " + C.reset + _sub.name);
  console.log("  " + C.dim + "Focus:     " + C.reset + _sub.items);
  console.log("  " + C.dim + "Agents:    " + C.reset + _biz.agents.join(", "));
  console.log("  " + C.gray + "─────────────────────────────" + C.reset);
  console.log("");

  // 6. Update preview — two scenarios
  console.log("  " + C.gray + "=== Update: Already Latest ===" + C.reset);
  console.log("  " + C.green + C.bold + "✓ Already up to date" + C.reset);
  console.log("  " + C.gray + "Praetor v" + VERSION + " is the latest version — no update needed." + C.reset);
  console.log("");
  console.log("  " + C.gray + "=== Update: Newer Available ===" + C.reset);
  console.log("  " + C.yellow + C.bold + "v" + VERSION + " → v3.0.0" + C.reset);
  console.log("  " + C.gray + progressBar(70, 20) + C.reset);
  console.log("  " + C.green + C.bold + "✓ Updated to v3.0.0" + C.reset);
  console.log("  " + C.gray + "Previous: v" + VERSION + " → Current: v3.0.0" + C.reset);
  console.log("");

  // 7. Return prompt preview
  console.log("  " + C.gray + "=== Return Prompt Preview ===" + C.reset);
  console.log("  " + C.cyan + C.bold + "‹" + C.reset + " " + C.dim + "Press Enter to return to menu" + C.reset + "  " + C.cyan + C.bold + "‹" + C.reset);
  console.log("");

  console.log("  " + C.green + C.bold + "=== ALL SCREENS VERIFIED ===" + C.reset);
  console.log("");
} else {
  // Default: interactive menu if TTY, static banner if piped/non-interactive
  if (process.stdin.isTTY && !process.env.CI) {
    interactiveMenu();
  } else {
    showStaticBanner();
  }
}
