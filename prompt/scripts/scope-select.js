#!/usr/bin/env node

/**
 * Praetor Scope Selector — Interactive audit scope picker.
 *
 * Usage:
 *   node scope-select.js           # interactive (numbered list)
 *   node scope-select.js --json    # output JSON (for piping)
 *   node scope-select.js --list    # list scopes and exit
 *
 * User selects by number, range, or keyword. Outputs the selected scopes.
 */

const readline = require("readline");

const SCOPES = [
  {
    id: "full",
    label: "Full Production Readiness Audit",
    desc: "All 5 categories, all 18 agents, all phases",
    agents: "A00–A17 + QC",
    categories: ["ENG", "BIZ", "OPS", "SUP", "COMP"],
  },
  {
    id: "engineering",
    label: "Engineering & QA",
    tag: "ENG",
    desc: "Unit tests, integration, API, middleware, security, perf, a11y, edge cases",
    agents: "A01–A05, A06, A07, A08, A09",
    categories: ["ENG"],
  },
  {
    id: "security",
    label: "Security & Compliance",
    tag: "SEC",
    desc: "OWASP Top 10, auth, secrets, threat model, compliance mapping (SOC2/GDPR/HIPAA/PCI)",
    agents: "A06, A16",
    categories: ["ENG", "COMP"],
  },
  {
    id: "business",
    label: "Business & Product",
    tag: "BIZ",
    desc: "Business rules, workflow validation, UAT scenarios, domain mapping",
    agents: "A02, A10, A11",
    categories: ["BIZ"],
  },
  {
    id: "operations",
    label: "Operations & SRE",
    tag: "OPS",
    desc: "Runbooks, alerting, monitoring, chaos engineering, disaster recovery",
    agents: "A03, A09, A12, A13",
    categories: ["OPS"],
  },
  {
    id: "support",
    label: "Support & Customer Experience",
    tag: "SUP",
    desc: "Triage trees, customer comms, known-issue DB, escalation paths",
    agents: "A14, A15",
    categories: ["SUP"],
  },
  {
    id: "risk",
    label: "Risk & Compliance Only",
    tag: "RISK",
    desc: "Risk register, compliance mapping, audit evidence, secret scan",
    agents: "A06, A16, A17",
    categories: ["COMP"],
  },
  {
    id: "quick",
    label: "Quick Smoke Test",
    tag: "QUICK",
    desc: "Discovery + critical path only: security, perf, basic engineering",
    agents: "A01, A04, A06, A07",
    categories: ["ENG"],
  },
];

// ---------------------------------------------------------------------------

function printBanner() {
  console.log("");
  console.log("  ╔══════════════════════════════════════════════════════════════╗");
  console.log("  ║  PRAETOR — Select Audit Scope                                ║");
  console.log("  ╚══════════════════════════════════════════════════════════════╝");
  console.log("");
}

function printScopes() {
  for (let i = 0; i < SCOPES.length; i++) {
    const s = SCOPES[i];
    const tag = s.tag ? " [" + s.tag + "]" : "";
    console.log("  " + (i + 1) + ". " + s.label + tag);
    console.log("     " + s.desc);
    if (i < SCOPES.length - 1) console.log("");
  }
  console.log("");
  console.log("  Select by number, range (e.g. 2-4), or comma-separated (e.g. 2,4,6)");
  console.log("  Press Enter for [1] (Full Audit)");
  console.log("");
}

function parseSelection(input) {
  const trimmed = input.trim();
  if (trimmed === "" || trimmed === "1") return [SCOPES[0]];

  const indices = new Set();

  // Handle ranges like "2-4"
  for (const part of trimmed.split(",")) {
    const p = part.trim();
    if (p.includes("-")) {
      const [start, end] = p.split("-").map((x) => parseInt(x.trim(), 10));
      if (!isNaN(start) && !isNaN(end)) {
        for (let i = start; i <= end; i++) {
          if (i >= 1 && i <= SCOPES.length) indices.add(i - 1);
        }
      }
    } else {
      const n = parseInt(p, 10);
      if (!isNaN(n) && n >= 1 && n <= SCOPES.length) indices.add(n - 1);
    }
  }

  if (indices.size === 0) return [SCOPES[0]]; // default to full
  return Array.from(indices).sort().map((i) => SCOPES[i]);
}

function formatOutput(selected, json) {
  if (json) {
    const out = selected.map((s) => ({
      id: s.id,
      label: s.label,
      tag: s.tag || null,
      agents: s.agents,
      categories: s.categories,
    }));
    return JSON.stringify(out, null, 2);
  }

  const lines = [];
  lines.push("");
  lines.push("  Selected scope:");
  for (const s of selected) {
    const tag = s.tag ? " [" + s.tag + "]" : "";
    lines.push("    → " + s.label + tag);
  }

  // Collect unique categories and agents
  const cats = [...new Set(selected.flatMap((s) => s.categories))];
  const agents = selected.map((s) => s.agents).join(", ");

  lines.push("");
  lines.push("  Categories: " + cats.join(", "));
  lines.push("  Agents:     " + agents);
  lines.push("");
  return lines.join("\n");
}

// ---------------------------------------------------------------------------

const flag = process.argv[2] || "";

if (flag === "--list") {
  printScopes();
  process.exit(0);
}

// Non-interactive JSON mode (for scripting)
if (flag === "--json") {
  const input = process.argv[3] || "1";
  const selected = parseSelection(input);
  console.log(formatOutput(selected, true));
  process.exit(0);
}

// Interactive mode
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

printBanner();
printScopes();

rl.question("  Your selection [1]: ", (answer) => {
  const selected = parseSelection(answer);
  console.log(formatOutput(selected, false));
  rl.close();
});
