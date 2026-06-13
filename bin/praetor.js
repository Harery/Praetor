#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const PKG_ROOT = path.join(__dirname, "..");
const PROMPT_DIR = path.join(PKG_ROOT, "prompt");
const MASTER_PROMPT = path.join(PROMPT_DIR, "00-orchestrator", "MASTER_PROMPT.md");

const args = process.argv.slice(2);

function showWelcome() {
  console.log("");
  console.log("  ╔══════════════════════════════════════════════════════════════╗");
  console.log("  ║  PRAETOR v2.8.4 — Production Readiness & Audit System        ║");
  console.log("  ║  18 Expert Agents · 4-Judge QC · 100% File-Line Traceability ║");
  console.log("  ╚══════════════════════════════════════════════════════════════╝");
  console.log("");
  console.log("  Quick Start:");
  console.log("    1. Open: " + MASTER_PROMPT);
  console.log("    2. Copy everything from the ═══ separator line");
  console.log("    3. Paste into Claude, ChatGPT, or any long-context LLM");
  console.log("    4. Append: Source Codebase: https://github.com/your-org/your-repo");
  console.log("    5. Reply: continue");
  console.log("    (Tip: npx praetor-audit-kit --prompt prints the prompt directly.)");
  console.log("");
  console.log("  Claude Code:");
  console.log("    npx praetor-audit-kit --install");
  console.log("");
  console.log("  Docs: https://github.com/Harery/Praetor");
  console.log("");
}

function showPrompt() {
  if (!fs.existsSync(MASTER_PROMPT)) {
    console.error("Error: Master prompt not found at", MASTER_PROMPT);
    process.exit(1);
  }

  const content = fs.readFileSync(MASTER_PROMPT, "utf-8");
  // Match the actual separator line (══════════...) not the inline backtick reference
  const sepRegex = /\n═══{10,}/;
  const match = content.match(sepRegex);

  if (!match) {
    console.log(content);
  } else {
    console.log(content.slice(match.index + 1));
  }
}

function showPath() {
  console.log(path.resolve(MASTER_PROMPT));
}

function installSkill() {
  const home = process.env.HOME || process.env.USERPROFILE;
  if (!home) {
    console.error("Error: Cannot determine home directory.");
    process.exit(1);
  }

  const dest = path.join(home, ".claude", "skills", "praetor");

  if (!fs.existsSync(PROMPT_DIR)) {
    console.error("Error: prompt/ directory not found at", PROMPT_DIR);
    process.exit(1);
  }

  // Remove old install if present
  if (fs.existsSync(dest)) {
    fs.rmSync(dest, { recursive: true, force: true });
  }

  // Copy entire prompt/ tree to ~/.claude/skills/praetor/
  copyDirSync(PROMPT_DIR, dest);

  const fileCount = countFiles(dest);
  console.log("");
  console.log("  Praetor skill installed to " + dest);
  console.log("  " + fileCount + " files copied.");
  console.log("");
  console.log("  Usage:");
  console.log("    Start a new Claude Code session, then:");
  console.log("    /praetor");
  console.log("    (or mention \"audit\", \"production readiness\", etc.)");
  console.log("");
}

function copyDirSync(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === ".DS_Store") continue;
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
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
    if (entry.isDirectory()) {
      count += countFiles(p);
    } else {
      count++;
    }
  }
  return count;
}

if (args.includes("--welcome") || args.includes("-w")) {
  showWelcome();
} else if (args.includes("--prompt") || args.includes("-p")) {
  showPrompt();
} else if (args.includes("--path") || args.includes("-l")) {
  showPath();
} else if (args.includes("--install") || args.includes("-i")) {
  installSkill();
} else if (args.includes("--help") || args.includes("-h")) {
  console.log("");
  console.log("  praetor-audit-kit v2.8.4");
  console.log("");
  console.log("  Usage: npx praetor-audit-kit [option]");
  console.log("");
  console.log("  Options:");
  console.log("    -w, --welcome   Show welcome message and quick start guide");
  console.log("    -p, --prompt    Output the master prompt (paste into LLM)");
  console.log("    -i, --install   Install as Claude Code skill (~/.claude/skills/praetor/)");
  console.log("    -l, --path      Show path to MASTER_PROMPT.md");
  console.log("    -h, --help      Show this help message");
  console.log("");
  console.log("  Examples:");
  console.log("    npx praetor-audit-kit");
  console.log("    npx praetor-audit-kit --prompt > prompt.txt");
  console.log("    npx praetor-audit-kit --install");
  console.log("");
} else {
  showWelcome();
}
