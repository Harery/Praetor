#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const PROMPT_DIR = path.join(__dirname, "..", "prompt");
const MASTER_PROMPT = path.join(PROMPT_DIR, "00-orchestrator", "MASTER_PROMPT.md");
const SEPARATOR = "═══";

const args = process.argv.slice(2);

function showWelcome() {
  console.log("");
  console.log("  ╔══════════════════════════════════════════════════════════════╗");
  console.log("  ║  PRAETOR v2.5 — Production Readiness & Audit System          ║");
  console.log("  ║  18 Expert Agents · 4-Judge QC · 100% File-Line Traceability ║");
  console.log("  ╚══════════════════════════════════════════════════════════════╝");
  console.log("");
  console.log("  Quick Start:");
  console.log("    1. Open: node_modules/praetor-audit-kit/prompt/00-orchestrator/MASTER_PROMPT.md");
  console.log("    2. Copy everything from the ═══ separator line");
  console.log("    3. Paste into Claude, GPT-5, or any long-context LLM");
  console.log("    4. Append: Source Codebase: https://github.com/your-org/your-repo");
  console.log("    5. Reply: continue");
  console.log("");
  console.log("  Claude Code: claude skill install node_modules/praetor-audit-kit/Skill/praetor.skill");
  console.log("  Docs:        https://github.com/Harery/Praetor");
  console.log("");
}

function showPrompt() {
  if (!fs.existsSync(MASTER_PROMPT)) {
    console.error("Error: Master prompt not found at", MASTER_PROMPT);
    process.exit(1);
  }

  const content = fs.readFileSync(MASTER_PROMPT, "utf-8");
  const sepIndex = content.indexOf(SEPARATOR);

  if (sepIndex === -1) {
    console.log(content);
  } else {
    console.log(content.slice(sepIndex));
  }
}

function showPath() {
  console.log(path.resolve(MASTER_PROMPT));
}

if (args.includes("--welcome") || args.includes("-w")) {
  showWelcome();
} else if (args.includes("--prompt") || args.includes("-p")) {
  showPrompt();
} else if (args.includes("--path") || args.includes("--l")) {
  showPath();
} else if (args.includes("--help") || args.includes("-h")) {
  console.log("");
  console.log("  praetor-audit-kit v2.5");
  console.log("");
  console.log("  Usage: npx praetor-audit-kit [option]");
  console.log("");
  console.log("  Options:");
  console.log("    -w, --welcome   Show welcome message and quick start guide");
  console.log("    -p, --prompt     Output the master prompt (paste into LLM)");
  console.log("    -l, --path       Show path to MASTER_PROMPT.md");
  console.log("    -h, --help       Show this help message");
  console.log("");
  console.log("  Examples:");
  console.log("    npx praetor-audit-kit");
  console.log("    npx praetor-audit-kit --prompt > prompt.txt");
  console.log("");
} else {
  showWelcome();
}
