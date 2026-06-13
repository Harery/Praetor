#!/usr/bin/env node

/**
 * Praetor Scope Selector — TUI with arrow keys, sub-scope drill-down, aliases.
 *
 * Usage:
 *   node scope-select.js                # interactive TUI
 *   node scope-select.js --no-tui       # numbered list only (Windows/CI safe)
 *   node scope-select.js --list         # static list
 *   node scope-select.js --json 2       # JSON for scope #2
 *   node scope-select.js --json eng     # JSON for alias "eng"
 *   node scope-select.js --drill 4 2    # drill into scope 4, sub-scope 2
 *   node scope-select.js --drill biz 3  # alias works here too
 */

const fs = require("fs");
const path = require("path");

// -- Load scopes from manifest ------------------------------------------------

const SCOPES_PATH = path.join(__dirname, "scopes.json");
const MANIFEST = JSON.parse(fs.readFileSync(SCOPES_PATH, "utf-8"));
const SCOPES = MANIFEST.scopes;

// Build alias lookup
const ALIAS_MAP = {};
for (let i = 0; i < SCOPES.length; i++) {
  ALIAS_MAP[String(i + 1)] = i; // numeric
  for (const alias of SCOPES[i].aliases) {
    ALIAS_MAP[alias.toLowerCase()] = i;
  }
}

function resolveScope(input) {
  const key = String(input).trim().toLowerCase();
  if (key === "") return 0;
  if (key in ALIAS_MAP) return ALIAS_MAP[key];
  return -1;
}

// -- ANSI helpers -------------------------------------------------------------

const C = {
  reset: "\x1b[0m", bold: "\x1b[1m", dim: "\x1b[2m",
  cyan: "\x1b[36m", yellow: "\x1b[33m", green: "\x1b[32m",
  fgCyan: "\x1b[96m", fgYellow: "\x1b[93m", red: "\x1b[31m",
  hide: "\x1b[?25l", show: "\x1b[?25h",
};

// -- Terminal helpers (P1-6) --------------------------------------------------

function getTermHeight() {
  try {
    if (process.stdout.rows && process.stdout.rows > 0) return process.stdout.rows;
  } catch {}
  return 24; // safe default
}

function truncateSubs(subs, maxLines) {
  // Each sub takes 3 lines (separator + name + items). Header=2, footer=1, agents=1
  const available = maxLines - 4; // header(2) + footer(1) + agents(1)
  const maxSubs = Math.floor(available / 3);
  if (subs.length <= maxSubs) return { subs, truncated: 0 };
  return {
    subs: subs.slice(0, maxSubs),
    truncated: subs.length - maxSubs,
  };
}

// -- Render -------------------------------------------------------------------

const W = 64;
const SUB_W = W - 2;

function renderHeader() {
  return [
    "",
    "  ╔" + "═".repeat(W) + "╗",
    "  ║  " + C.bold + C.cyan + "PRAETOR" + C.reset + " — Select Audit Scope" + " ".repeat(W - 26) + "║",
    "  ╚" + "═".repeat(W) + "╝",
    "",
  ];
}

function renderDrillHeader(scope) {
  const tag = scope.tag ? " [" + scope.tag + "]" : "";
  return [
    "",
    "  ╔" + "═".repeat(W) + "╗",
    "  ║  " + C.bold + C.cyan + "PRAETOR" + C.reset + " — " + scope.label + tag + " — Sub-scope Drill-down" + " ".repeat(Math.max(0, W - 26 - scope.label.length - (scope.tag ? scope.tag.length + 3 : 0) - 22)) + "║",
    "  ╚" + "═".repeat(W) + "╝",
    "",
  ];
}

function renderScopeList(cursor, multiSelect, subsInfo) {
  const out = renderHeader();
  out.push("  " + C.dim + "↑↓ arrows · Enter select · Space multi · d=drill-down · Esc back" + C.reset);
  out.push("");

  for (let i = 0; i < SCOPES.length; i++) {
    const s = SCOPES[i];
    const tag = s.tag ? C.fgCyan + " [" + s.tag + "]" + C.reset : "";
    const num = C.dim + (i + 1) + "." + C.reset;
    const isActive = i === cursor;
    const isSelected = multiSelect.has(i);
    const check = isSelected ? C.green + "●" + C.reset : C.dim + "○" + C.reset;

    if (isActive) {
      out.push("  " + C.bold + C.yellow + " ▸ " + num + " " + s.label + tag + C.reset);
      out.push("  " + C.dim + "     " + s.desc + C.reset);
    } else {
      out.push("  " + check + " " + num + " " + s.label + tag);
    }
    out.push("");
  }

  // Detail pane with height-aware truncation
  const scope = SCOPES[cursor];
  if (scope.sub && scope.sub.length > 0) {
    const termH = getTermHeight();
    const usedLines = out.length + 5; // approximate lines above detail pane
    const remaining = termH - usedLines;
    const { subs: displaySubs, truncated } = truncateSubs(scope.sub, remaining);

    out.push("  " + C.fgCyan + "┌─┬" + "─".repeat(SUB_W - 2) + "┐" + C.reset);
    const tagLabel = scope.tag ? " [" + scope.tag + "]" : "";
    out.push("  " + C.fgCyan + "│" + C.reset + " " + C.bold + C.fgCyan + scope.label + tagLabel + " — sub-scopes" + C.reset);

    for (const sub of displaySubs) {
      out.push("  " + C.fgCyan + "├─┼" + "─".repeat(SUB_W - 2) + "┤" + C.reset);
      out.push("  " + C.fgCyan + "│" + C.reset + " " + C.fgYellow + sub.name + C.reset);
      out.push("  " + C.fgCyan + "│" + C.reset + " " + C.dim + sub.items + C.reset);
    }

    if (truncated > 0) {
      out.push("  " + C.fgCyan + "├─┼" + "─".repeat(SUB_W - 2) + "┤" + C.reset);
      out.push("  " + C.fgCyan + "│" + C.reset + " " + C.dim + "... " + truncated + " more sub-scopes (press d to drill down)" + C.reset);
    }

    out.push("  " + C.fgCyan + "└─┴" + "─".repeat(SUB_W - 2) + "┘" + C.reset);
    out.push("");
    out.push("  " + C.dim + "Agents: " + scope.agents.join(", ") + " · Categories: " + scope.categories.join(", ") + C.reset);
  }
  out.push("");
  return out;
}

function renderDrillDown(scope, cursor, selectedSubs) {
  const out = renderDrillHeader(scope);
  out.push("  " + C.dim + "↑↓ select · Space multi · Enter confirm · Esc back to scope list" + C.reset);
  out.push("");

  for (let i = 0; i < scope.sub.length; i++) {
    const sub = scope.sub[i];
    const isActive = i === cursor;
    const isSelected = selectedSubs.has(i);
    const check = isSelected ? C.green + "●" + C.reset : C.dim + "○" + C.reset;
    const num = C.dim + (i + 1) + "." + C.reset;

    if (isActive) {
      out.push("  " + C.bold + C.yellow + " ▸ " + num + " " + sub.name + C.reset);
      out.push("  " + C.dim + "     " + sub.items + C.reset);
    } else {
      out.push("  " + check + " " + num + " " + sub.name);
    }
    out.push("");
  }

  // Summary
  if (selectedSubs.size > 0) {
    out.push("  " + C.green + "Selected: " + Array.from(selectedSubs).map(i => scope.sub[i].name).join(", ") + C.reset);
  } else {
    out.push("  " + C.dim + "Select sub-scopes or press Enter for all" + C.reset);
  }
  out.push("");
  return out;
}

function renderResult(selected) {
  const lines = [];
  lines.push("");
  lines.push("  " + C.bold + C.green + "✓" + C.reset + " Selected scope:");

  for (const s of selected) {
    const tag = s.tag ? C.fgCyan + " [" + s.tag + "]" + C.reset : "";
    lines.push("    " + C.green + "→" + C.reset + " " + s.label + tag);
  }

  const cats = [...new Set(selected.flatMap((s) => s.categories))];
  const agents = [...new Set(selected.flatMap((s) => s.agents))];
  lines.push("");
  lines.push("  " + C.dim + "Categories: " + cats.join(", "));
  lines.push("  " + C.dim + "Agents:     " + agents.join(", "));
  lines.push("");

  // Sub-scopes
  for (const s of selected) {
    if (s.sub && s.sub.length > 0) {
      lines.push("  " + C.dim + s.label + " sub-scopes:");
      for (const sub of s.sub) {
        lines.push("    " + C.fgYellow + "●" + C.reset + " " + sub.name + ": " + C.dim + sub.items + C.reset);
      }
    }
  }
  lines.push("");
  return lines.join("\n");
}

// -- Parse selection (with alias support) -------------------------------------

function parseSelection(input) {
  const trimmed = (input || "").trim();
  if (trimmed === "") return [SCOPES[0]];
  const indices = new Set();
  for (const part of trimmed.split(",")) {
    const p = part.trim();
    if (p.includes("-")) {
      const [startStr, endStr] = p.split("-");
      const startIdx = resolveScope(startStr);
      const endIdx = resolveScope(endStr);
      if (startIdx >= 0 && endIdx >= 0) {
        for (let i = startIdx; i <= endIdx; i++) indices.add(i);
      }
    } else {
      const idx = resolveScope(p);
      if (idx >= 0) indices.add(idx);
    }
  }
  if (indices.size === 0) return [SCOPES[0]];
  return Array.from(indices).sort().map((i) => SCOPES[i]);
}

// -- Static list (P2-9: --no-tui / --list) ------------------------------------

function staticList() {
  for (let i = 0; i < SCOPES.length; i++) {
    const s = SCOPES[i];
    const tag = s.tag ? " [" + s.tag + "]" : "";
    const aliases = s.aliases.filter(a => a !== String(i + 1)).join(", ");
    console.log("  " + (i + 1) + ". " + s.label + tag + (aliases ? C.dim + " (aliases: " + aliases + ")" + C.reset : ""));
    console.log("     " + s.desc);
    if (s.sub) {
      for (const sub of s.sub) {
        console.log("       ├─ " + sub.name + ": " + sub.items);
      }
    }
    console.log("     Agents: " + s.agents.join(", ") + " · Categories: " + s.categories.join(", "));
    console.log("");
  }
}

function noTuiSelect() {
  staticList();
  console.log("  Enter scope number, alias, or range (e.g. 2, 4-6, eng, biz):");

  // Read from stdin (line-buffered, not raw)
  const readline = require("readline");
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  rl.question("  > ", (answer) => {
    rl.close();
    const selected = parseSelection(answer);
    console.log(renderResult(selected));
    process.exit(0);
  });
}

// -- JSON output --------------------------------------------------------------

function jsonOutput(input) {
  const selected = parseSelection(input);
  console.log(JSON.stringify(selected.map((s) => ({
    id: s.id, label: s.label, tag: s.tag || null,
    agents: s.agents, categories: s.categories,
    sub: (s.sub || []).map((x) => ({ id: x.id, name: x.name, items: x.items })),
  })), null, 2));
  process.exit(0);
}

// -- Drill-down JSON (P1-4) ---------------------------------------------------

function drillOutput(scopeInput, subInput) {
  const scopeIdx = resolveScope(scopeInput);
  if (scopeIdx < 0) { console.error("Unknown scope: " + scopeInput); process.exit(1); }
  const scope = SCOPES[scopeIdx];

  let selectedSubs;
  if (subInput === undefined || subInput === "") {
    selectedSubs = scope.sub; // all
  } else {
    const subIdx = parseInt(subInput, 10) - 1;
    if (subIdx >= 0 && subIdx < scope.sub.length) {
      selectedSubs = [scope.sub[subIdx]];
    } else {
      // Try alias match
      const match = scope.sub.find(s => s.id === subInput.toLowerCase());
      selectedSubs = match ? [match] : scope.sub;
    }
  }

  console.log(JSON.stringify({
    scope: { id: scope.id, label: scope.label, tag: scope.tag || null },
    agents: scope.agents,
    categories: scope.categories,
    selectedSubs: selectedSubs.map(s => ({ id: s.id, name: s.name, items: s.items })),
  }, null, 2));
  process.exit(0);
}

// -- Interactive TUI ----------------------------------------------------------

function interactiveTUI(forceNoTui) {
  if (forceNoTui || !process.stdin.isTTY) {
    // Non-TTY fallback
    if (!process.stdin.isTTY) {
      const selected = parseSelection("1");
      console.log(JSON.stringify(selected.map((s) => s.id)));
      process.exit(0);
    }
    noTuiSelect();
    return;
  }

  let mode = "scopes"; // "scopes" | "drill"
  let cursor = 0;
  const multiSelect = new Set();
  let drillCursor = 0;
  const drillSelected = new Set();
  let drillScope = null;

  process.stdin.setRawMode(true);
  process.stdin.resume();
  process.stdin.setEncoding("utf8");
  process.stdout.write(C.hide);

  function draw() {
    const lines = mode === "scopes"
      ? renderScopeList(cursor, multiSelect)
      : renderDrillDown(drillScope, drillCursor, drillSelected);
    process.stdout.write("\x1b[2J\x1b[H" + lines.join("\n"));
  }

  draw();

  process.stdin.on("data", (key) => {
    const MOVE_UP = "\x1b[A";
    const MOVE_DOWN = "\x1b[B";
    const ENTER = "\r";
    const ESC = "\x1b";

    if (mode === "scopes") {
      // Number keys — quick select
      if (/^[1-8]$/.test(key)) {
        const n = parseInt(key, 10) - 1;
        cursor = n;
        multiSelect.clear();
        multiSelect.add(n);
        draw();
        finish();
        return;
      }

      if (key === MOVE_UP || key === "k") {
        cursor = (cursor - 1 + SCOPES.length) % SCOPES.length;
        draw();
      } else if (key === MOVE_DOWN || key === "j") {
        cursor = (cursor + 1) % SCOPES.length;
        draw();
      } else if (key === " ") {
        if (multiSelect.has(cursor)) multiSelect.delete(cursor);
        else multiSelect.add(cursor);
        draw();
      } else if (key === "d" || key === "D") {
        // Drill down into current scope
        drillScope = SCOPES[cursor];
        drillCursor = 0;
        drillSelected.clear();
        mode = "drill";
        draw();
      } else if (key === ENTER) {
        if (multiSelect.size === 0) multiSelect.add(cursor);
        draw();
        finish();
      } else if (key === ESC || key === "\x03") {
        process.stdout.write(C.show + "\x1b[2J\x1b[H");
        process.exit(1);
      }
    } else if (mode === "drill") {
      if (key === MOVE_UP || key === "k") {
        drillCursor = (drillCursor - 1 + drillScope.sub.length) % drillScope.sub.length;
        draw();
      } else if (key === MOVE_DOWN || key === "j") {
        drillCursor = (drillCursor + 1) % drillScope.sub.length;
        draw();
      } else if (key === " ") {
        if (drillSelected.has(drillCursor)) drillSelected.delete(drillCursor);
        else drillSelected.add(drillCursor);
        draw();
      } else if (key === ENTER) {
        // If no sub-scopes selected, select all; otherwise only selected
        finishDrill();
      } else if (key === ESC || key === "\x03") {
        mode = "scopes";
        draw();
      }
    }
  });

  function finish() {
    process.stdin.setRawMode(false);
    process.stdin.pause();
    const indices = Array.from(multiSelect).sort((a, b) => a - b);
    const selected = indices.map((i) => SCOPES[i]);
    process.stdout.write(C.show + "\x1b[2J\x1b[H");
    console.log(renderResult(selected));
    process.exit(0);
  }

  function finishDrill() {
    process.stdin.setRawMode(false);
    process.stdin.pause();
    const subs = drillSelected.size > 0
      ? Array.from(drillSelected).sort().map(i => drillScope.sub[i])
      : drillScope.sub;

    process.stdout.write(C.show + "\x1b[2J\x1b[H");
    console.log("");
    console.log("  " + C.bold + C.green + "✓" + C.reset + " " + drillScope.label + (drillScope.tag ? " [" + drillScope.tag + "]" : ""));
    console.log("  " + C.dim + "Agents: " + drillScope.agents.join(", ") + " · Categories: " + drillScope.categories.join(", "));
    console.log("");
    console.log("  " + C.bold + "Selected sub-scopes:" + C.reset);
    for (const sub of subs) {
      console.log("    " + C.fgYellow + "●" + C.reset + " " + sub.name);
      console.log("      " + C.dim + sub.items + C.reset);
    }
    console.log("");
    process.exit(0);
  }
}

// -- CLI routing --------------------------------------------------------------

const flag = process.argv[2] || "";

if (flag === "--list") { staticList(); process.exit(0); }
if (flag === "--json") { jsonOutput(process.argv[3] || "1"); }
if (flag === "--drill") { drillOutput(process.argv[3], process.argv[4]); }
if (flag === "--no-tui") { interactiveTUI(true); }
else if (process.argv.length <= 2 || flag === "") { interactiveTUI(false); }
else { interactiveTUI(false); }
