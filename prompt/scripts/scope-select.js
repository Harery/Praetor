#!/usr/bin/env node

/**
 * Praetor Scope Selector — TUI with arrow keys, numbered list, sub-scope detail pane.
 *
 * Usage:
 *   node scope-select.js           # interactive TUI (arrow keys + numbers)
 *   node scope-select.js --json 2  # JSON output for scripting
 *   node scope-select.js --list    # static list (no TUI)
 */

// -- ANSI helpers -----------------------------------------------------------

const C = {
  reset:   "\x1b[0m",
  bold:    "\x1b[1m",
  dim:     "\x1b[2m",
  cyan:    "\x1b[36m",
  yellow:  "\x1b[33m",
  green:   "\x1b[32m",
  magenta: "\x1b[35m",
  blue:    "\x1b[34m",
  white:   "\x1b[37m",
  bgBlack: "\x1b[40m",
  fgGray:  "\x1b[90m",
  fgCyan:  "\x1b[96m",
  fgYellow:"\x1b[93m",
  hide:    "\x1b[?25l",
  show:    "\x1b[?25h",
};

const MOVE = {
  up:    "\x1b[A",
  down:  "\x1b[B",
  enter: "\r",
  esc:   "\x1b",
};

// -- Scope data with sub-scopes --------------------------------------------

const SCOPES = [
  {
    id: "full",
    label: "Full Production Readiness Audit",
    desc: "All 5 categories \u00b7 all 18 agents \u00b7 all 7 phases",
    agents: "A00\u2013A17 + QC",
    categories: ["ENG", "BIZ", "OPS", "SUP", "COMP"],
    sub: [
      { name: "Engineering & QA",       items: "20 test types \u00b7 unit, integration, API, middleware, edge cases, perf, a11y" },
      { name: "Security",               items: "OWASP Top 10 \u00b7 auth \u00b7 secrets \u00b7 injection \u00b7 CSRF/SSRF \u00b7 crypto" },
      { name: "Business & Product",     items: "Business rules \u00b7 workflows \u00b7 UAT \u00b7 domain mapping" },
      { name: "Operations & SRE",       items: "Runbooks \u00b7 alerting \u00b7 monitoring \u00b7 chaos \u00b7 DR" },
      { name: "Support & CX",           items: "Triage trees \u00b7 customer comms \u00b7 escalation paths" },
      { name: "Compliance",             items: "SOC2 \u00b7 GDPR \u00b7 HIPAA \u00b7 PCI \u00b7 WCAG \u00b7 audit evidence" },
      { name: "Risk Register",          items: "Risk scoring \u00b7 severity mapping \u00b7 secret scan" },
    ],
  },
  {
    id: "engineering",
    label: "Engineering & QA",
    tag: "ENG",
    desc: "Unit tests, integration, API, middleware, security, perf, a11y, edge cases",
    agents: "A01\u2013A05, A06, A07, A08, A09",
    categories: ["ENG"],
    sub: [
      { name: "Functional & Logic",     items: "Branches \u00b7 state mutations \u00b7 lifecycle \u00b7 async (A.1)" },
      { name: "Business Rules",         items: "Positive / negative / boundary per BR & INV (A.2)" },
      { name: "Workflow & State Machine", items: "Transitions \u00b7 guards \u00b7 idempotency (A.3)" },
      { name: "API & Contract",         items: "Schema \u00b7 status codes \u00b7 versioning \u00b7 backward compat (A.6)" },
      { name: "Middleware",             items: "Order \u00b7 short-circuit \u00b7 rate limit \u00b7 CORS \u00b7 auth (A.7)" },
      { name: "Data Layer",             items: "Constraints \u00b7 multi-tenancy \u00b7 transactions \u00b7 migrations (A.9)" },
      { name: "Security Tests",         items: "AuthN/Z \u00b7 injection \u00b7 XSS \u00b7 CSRF \u00b7 OWASP Top 10 (A.14)" },
      { name: "Performance",            items: "Latency budgets \u00b7 N+1 \u00b7 bundle size \u00b7 cold start (A.13)" },
      { name: "Accessibility",          items: "WCAG 2.1 AA \u00b7 keyboard \u00b7 screen reader \u00b7 contrast (A.11)" },
      { name: "Edge Cases & Chaos",     items: "Boundaries \u00b7 races \u00b7 scope leaks \u00b7 fuzz (A.17, A.18)" },
      { name: "Integration Tests",      items: "Timeout \u00b7 retry \u00b7 circuit breaker \u00b7 DLQ (A.8)" },
      { name: "E2E Workflows",          items: "Full stack: UI \u2192 controller \u2192 service \u2192 DB \u2192 UI (A.5)" },
    ],
  },
  {
    id: "security",
    label: "Security & Compliance",
    tag: "SEC",
    desc: "OWASP Top 10, auth, secrets, threat model, compliance mapping",
    agents: "A06, A16",
    categories: ["ENG", "COMP"],
    sub: [
      { name: "Authentication",         items: "Session mgmt \u00b7 token lifecycle \u00b7 MFA \u00b7 OAuth/OIDC" },
      { name: "Authorization",          items: "RBAC \u00b7 ABAC \u00b7 IDOR \u00b7 privilege escalation \u00b7 cross-tenant" },
      { name: "Injection & XSS",        items: "SQL injection \u00b7 NoSQL injection \u00b7 XSS \u00b7 command injection" },
      { name: "CSRF & SSRF",            items: "Token validation \u00b7 origin checks \u00b7 internal service access" },
      { name: "Secrets & Crypto",       items: "Hardcoded secrets \u00b7 weak crypto \u00b7 key management \u00b7 secret scan" },
      { name: "Supply Chain",           items: "Dependency audit \u00b7 lockfile integrity \u00b7 typosquat detection" },
      { name: "Compliance Mapping",     items: "SOC2 \u00b7 GDPR \u00b7 HIPAA \u00b7 PCI-DSS controls" },
      { name: "Audit Evidence",         items: "Logging \u00b7 audit trails \u00b7 retention \u00b7 tamper detection" },
    ],
  },
  {
    id: "business",
    label: "Business & Product",
    tag: "BIZ",
    desc: "Business rules, workflow validation, UAT scenarios, domain mapping",
    agents: "A02, A10, A11",
    categories: ["BIZ"],
    sub: [
      { name: "Domain Mapping",         items: "Bounded contexts \u00b7 aggregates \u00b7 domain events \u00b7 ubiquitous language" },
      { name: "Business Rules",         items: "Invariants \u00b7 calculations \u00b7 decision tables \u00b7 rule coverage" },
      { name: "Workflow Validation",    items: "Happy path \u00b7 exception flows \u00b7 state transitions \u00b7 rollback" },
      { name: "UAT Scenarios",          items: "Acceptance criteria \u00b7 user story coverage \u00b7 edge personas" },
      { name: "Product Risk",           items: "Feature flags \u00b7 launch gates \u00b7 rollback criteria \u00b7 rollout plan" },
    ],
  },
  {
    id: "operations",
    label: "Operations & SRE",
    tag: "OPS",
    desc: "Runbooks, alerting, monitoring, chaos engineering, disaster recovery",
    agents: "A03, A09, A12, A13",
    categories: ["OPS"],
    sub: [
      { name: "Runbooks",               items: "Incident response \u00b7 SOPs \u00b7 escalation \u00b7 post-mortem templates" },
      { name: "Alerting",               items: "SLO-based alerts \u00b7 burn rate \u00b7 multi-channel \u00b7 routing rules" },
      { name: "Observability",          items: "Metrics \u00b7 traces \u00b7 logs \u00b7 dashboards \u00b7 anomaly detection" },
      { name: "Chaos Engineering",      items: "Network partition \u00b7 process kill \u00b7 latency injection \u00b7 CPU stress" },
      { name: "Disaster Recovery",      items: "RTO/RPO targets \u00b7 failover \u00b7 backup verification \u00b7 DR drill" },
      { name: "Infrastructure",         items: "IaC coverage \u00b7 config drift \u00b7 capacity planning \u00b7 cost hygiene" },
    ],
  },
  {
    id: "support",
    label: "Support & Customer Experience",
    tag: "SUP",
    desc: "Triage trees, customer comms, known-issue DB, escalation paths",
    agents: "A14, A15",
    categories: ["SUP"],
    sub: [
      { name: "Triage Trees",           items: "Decision trees \u00b7 symptom\u2192cause mapping \u00b7 auto-classification" },
      { name: "Customer Communications", items: "Status page \u00b7 incident updates \u00b7 post-mortem \u00b7 notification templates" },
      { name: "Known-Issue Database",   items: "Issue tracking \u00b7 workaround docs \u00b7 impact scoring \u00b7 linked bugs" },
      { name: "Escalation Paths",       items: "L1\u2192L2\u2192L3 routing \u00b7 on-call rotation \u00b7 SLA tracking" },
      { name: "Self-Service",           items: "FAQ \u00b7 knowledge base \u00b7 chatbot fallback \u00b7 community threads" },
    ],
  },
  {
    id: "risk",
    label: "Risk & Compliance Only",
    tag: "RISK",
    desc: "Risk register, compliance mapping, audit evidence, secret scan",
    agents: "A06, A16, A17",
    categories: ["COMP"],
    sub: [
      { name: "Risk Register",          items: "Likelihood \u00b7 impact \u00b7 severity scoring \u00b7 mitigation tracking" },
      { name: "Compliance Mapping",     items: "SOC2 \u00b7 GDPR Art. 5/25/32/35 \u00b7 HIPAA \u00b7 PCI-DSS \u00b7 WCAG" },
      { name: "Audit Evidence",         items: "Control verification \u00b7 traceability matrix \u00b7 retention policy" },
      { name: "Secret Scan & Lint",     items: "Hardcoded key detection \u00b7 masked findings table \u00b7 CI stage" },
      { name: "PII Handling",           items: "Classification \u00b7 data flow \u00b7 retention \u00b7 right to erasure" },
    ],
  },
  {
    id: "quick",
    label: "Quick Smoke Test",
    tag: "QUICK",
    desc: "Discovery + critical path: security, perf, basic engineering",
    agents: "A01, A04, A06, A07",
    categories: ["ENG"],
    sub: [
      { name: "Discovery",              items: "Tech stack \u00b7 structure \u00b7 entry points \u00b7 dependencies" },
      { name: "Security Critical",      items: "Auth \u00b7 secrets \u00b7 injection \u00b7 top 5 OWASP quick check" },
      { name: "Performance Quick",      items: "Latency budget \u00b7 N+1 scan \u00b7 cold start \u00b7 bundle size" },
      { name: "Engineering Basics",     items: "Unit test gaps \u00b7 error handling \u00b7 edge cases" },
    ],
  },
];

// -- TUI Renderer -----------------------------------------------------------

function clearScreen() {
  process.stdout.write("\x1b[2J\x1b[H");
}

function render(cursor, multiSelect) {
  const W = 64; // inner width
  const out = [];

  // Header
  out.push("");
  out.push("  \u2554" + "\u2550".repeat(W) + "\u2557");
  out.push("  \u2551  " + C.bold + C.cyan + "PRAETOR" + C.reset + " \u2014 Select Audit Scope" + " ".repeat(W - 26) + "\u2551");
  out.push("  \u255a" + "\u2550".repeat(W) + "\u255d");
  out.push("");
  out.push("  " + C.dim + "\u2191\u2193 arrows \u00b7 Enter select \u00b7 Space multi-select \u00b7 Esc cancel" + C.reset);
  out.push("");

  // Scope list
  for (let i = 0; i < SCOPES.length; i++) {
    const s = SCOPES[i];
    const tag = s.tag ? C.fgCyan + " [" + s.tag + "]" + C.reset : "";
    const num = C.dim + (i + 1) + "." + C.reset;
    const isActive = i === cursor;
    const isSelected = multiSelect.has(i);
    const check = isSelected ? C.green + "\u25cf" + C.reset : C.dim + "\u25cb" + C.reset;

    if (isActive) {
      out.push("  " + C.bold + C.yellow + " \u25b8 " + num + " " + s.label + tag + C.reset);
      out.push("  " + C.dim + "     " + s.desc + C.reset);
    } else {
      out.push("  " + check + " " + num + " " + s.label + tag);
    }
    out.push("");
  }

  // Detail pane — angled-line theme
  const scope = SCOPES[cursor];
  if (scope.sub && scope.sub.length > 0) {
    const subW = W - 2;
    out.push("  " + C.fgCyan + "\u250c" + "\u2500" + "\u252c" + "\u2500".repeat(subW - 2) + "\u2510" + C.reset);
    const tagLabel = scope.tag ? " [" + scope.tag + "]" : "";
    out.push("  " + C.fgCyan + "\u2502" + C.reset + " " + C.bold + C.fgCyan + scope.label + tagLabel + " \u2014 sub-scopes" + C.reset);

    for (const sub of scope.sub) {
      out.push("  " + C.fgCyan + "\u251c" + "\u2500" + "\u253c" + "\u2500".repeat(subW - 2) + "\u2524" + C.reset);
      out.push("  " + C.fgCyan + "\u2502" + C.reset + " " + C.fgYellow + sub.name + C.reset);
      out.push("  " + C.fgCyan + "\u2502" + C.reset + " " + C.dim + sub.items + C.reset);
    }

    out.push("  " + C.fgCyan + "\u2514" + "\u2500" + "\u2534" + "\u2500".repeat(subW - 2) + "\u2518" + C.reset);
    out.push("");
    out.push("  " + C.dim + "Agents: " + scope.agents + " \u00b7 Categories: " + scope.categories.join(", ") + C.reset);
  }

  out.push("");

  process.stdout.write("\x1b[2J\x1b[H" + out.join("\n"));
}

function renderResult(selected) {
  const lines = [];
  lines.push("");
  lines.push("  " + C.bold + C.green + "\u2713" + C.reset + " Selected scope:");

  for (const s of selected) {
    const tag = s.tag ? C.fgCyan + " [" + s.tag + "]" + C.reset : "";
    lines.push("    " + C.green + "\u2192" + C.reset + " " + s.label + tag);
  }

  const cats = [...new Set(selected.flatMap((s) => s.categories))];
  const agents = selected.map((s) => s.agents).join(", ");
  lines.push("");
  lines.push("  " + C.dim + "Categories: " + cats.join(", "));
  lines.push("  " + C.dim + "Agents:     " + agents);
  lines.push("");
  return lines.join("\n");
}

// -- Non-interactive modes ---------------------------------------------------

function parseSelection(input) {
  const trimmed = (input || "").trim();
  if (trimmed === "" || trimmed === "1") return [SCOPES[0]];
  const indices = new Set();
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
  if (indices.size === 0) return [SCOPES[0]];
  return Array.from(indices).sort().map((i) => SCOPES[i]);
}

function staticList() {
  for (let i = 0; i < SCOPES.length; i++) {
    const s = SCOPES[i];
    const tag = s.tag ? " [" + s.tag + "]" : "";
    console.log("  " + (i + 1) + ". " + s.label + tag);
    console.log("     " + s.desc);
    if (s.sub) {
      for (const sub of s.sub) {
        console.log("       \u251c\u2500 " + sub.name + ": " + sub.items);
      }
    }
    console.log("");
  }
}

// -- Main -------------------------------------------------------------------

const flag = process.argv[2] || "";

if (flag === "--list") { staticList(); process.exit(0); }

if (flag === "--json") {
  const input = process.argv[3] || "1";
  const selected = parseSelection(input);
  console.log(JSON.stringify(selected.map((s) => ({
    id: s.id, label: s.label, tag: s.tag || null,
    agents: s.agents, categories: s.categories,
    sub: (s.sub || []).map((x) => ({ name: x.name, items: x.items })),
  })), null, 2));
  process.exit(0);
}

// -- Interactive TUI ---------------------------------------------------------

if (!process.stdin.isTTY) {
  // Fallback for non-TTY (piped)
  const selected = parseSelection("1");
  console.log(JSON.stringify(selected.map((s) => s.id)));
  process.exit(0);
}

let cursor = 0;
const multiSelect = new Set();

process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.setEncoding("utf8");

process.stdout.write(C.hide);
render(cursor, multiSelect);

process.stdin.on("data", (key) => {
  // Number keys — quick select
  if (/^[1-8]$/.test(key)) {
    const n = parseInt(key, 10) - 1;
    cursor = n;
    multiSelect.clear();
    multiSelect.add(n);
    render(cursor, multiSelect);
    finish();
    return;
  }

  if (key === MOVE.up || key === "k") {
    cursor = (cursor - 1 + SCOPES.length) % SCOPES.length;
    render(cursor, multiSelect);
  } else if (key === MOVE.down || key === "j") {
    cursor = (cursor + 1) % SCOPES.length;
    render(cursor, multiSelect);
  } else if (key === " ") {
    // Toggle multi-select
    if (multiSelect.has(cursor)) {
      multiSelect.delete(cursor);
    } else {
      multiSelect.add(cursor);
    }
    render(cursor, multiSelect);
  } else if (key === MOVE.enter) {
    if (multiSelect.size > 0) {
      finish();
    } else {
      multiSelect.add(cursor);
      finish();
    }
  } else if (key === MOVE.esc || key === "\x03") { // Escape or Ctrl+C
    process.stdout.write(C.show + "\x1b[2J\x1b[H");
    process.exit(1);
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
