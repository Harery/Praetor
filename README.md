# Praetor

> **P**roduction **R**eadiness, **A**udit, **E**vidence, **T**esting, **O**perations, & **R**eview

A single-prompt, multi-agent system that transforms any codebase into a complete production readiness package with full file-line traceability.

## What is Praetor?

Praetor is an AI-powered orchestration system that reads your repository and dispatches **18 autonomous expert agents** (each with a 12-20 year persona, defined scope, and unilateral authority in their domain) to produce:

### Deliverables by Audience

| Audience | What You Get |
|---|---|
| **[ENG]** Engineering & QA | Unit, integration, security, performance, accessibility, and chaos test cases with executable scripts (k6, Playwright, fast-check) |
| **[BIZ]** Business | Plain-language verification matrices and UAT scripts |
| **[OPS]** Operations / SRE | 3am-grade runbooks and alert specs in your monitoring syntax (Datadog, Prometheus, etc.) |
| **[SUP]** Support / CX | Triage decision trees, error translations, and customer communication templates |
| **[COMP]** Compliance & Security | Control mappings (SOC2, GDPR, HIPAA, PCI, WCAG), PII flows, and audit evidence |
| **Cross-cutting** | Consolidated risk register with severity, owner, and dev-day estimates |

Every artifact carries:
- **STATUS tag** — `READY`, `INFERRED`, `BLOCKED_BY_MISSING_CODE`, etc.
- **Agent attribution** — which expert produced it
- **Register links** — connected to risk, role, workflow registers
- **File:line citations** — 100% verified by a 4-judge Quality Council

---

## Quick Start

1. **Copy the Master Prompt**
   ```
   Open: prompt/00-orchestrator/MASTER_PROMPT.md
   Select all (starting from the ═══ line)
   ```

2. **Paste into Claude** with your source:
   ```
   [paste Praetor Master Prompt]
   
   Source: https://github.com/myorg/myrepo.git
   ```

3. **Phase 0–2 runs automatically** (~2 minutes)
   - Source resolution
   - Technical discovery
   - Domain mapping

4. **Review the Discovery Report**
   - You'll receive a MUST CONFIRM block
   - Reply with answers per the `CONDITIONAL_CONTINUE` protocol:
   ```
   continue with:
     Q1 = <answer>
     Q2 = unknown
   override:
     RUN_MODULES = [M_AUTH]
   then continue
   ```

5. **Receive per-module outputs**
   - Reply `continue` to trigger the next module
   - Phase 6 wrap-up emits automatically

6. **Download and distribute**
   - Artifacts organized by audience (ENG, BIZ, OPS, SUP, COMP)
   - Register entries link all findings

---

## Project Structure

```
praetor/
├── README.md                                 ← this file
├── VERSION.md                                ← version history & changelog
│
├── prompt/                                   ← THE SYSTEM PROMPT
│   ├── 00-orchestrator/
│   │   ├── MASTER_PROMPT.md                  ← PASTE THIS INTO CLAUDE
│   │   └── AGENT_ROSTER.md                   ← all 18 agents at a glance
│   │
│   ├── 01-phases/                            ← 7 execution phases
│   │   ├── PHASE_0_source_resolution.md
│   │   ├── PHASE_1_technical_discovery.md
│   │   ├── PHASE_2_domain_mapping.md
│   │   ├── PHASE_3_discovery_report.md       ← MUST CONFIRM gate
│   │   ├── PHASE_4_agent_swarm.md
│   │   ├── PHASE_5_quality_council.md        ← inline review
│   │   └── PHASE_6_wrap_up.md
│   │
│   ├── 02-categories/                        ← 5 audience streams
│   │   ├── CAT_A_engineering.md
│   │   ├── CAT_B_business.md
│   │   ├── CAT_C_operations.md
│   │   ├── CAT_D_support.md
│   │   └── CAT_E_compliance.md
│   │
│   ├── 03-registers/REGISTERS.md             ← 12 register types
│   │
│   ├── 04-mandates/                          ← per-audience charters
│   │   ├── MANDATE_engineering.md
│   │   ├── MANDATE_business.md
│   │   ├── MANDATE_operations.md
│   │   ├── MANDATE_support.md
│   │   └── MANDATE_compliance.md
│   │
│   ├── 05-execution/                         ← run configuration
│   │   ├── TEAM_ASSIGNMENTS.md
│   │   ├── RUN_MODES.md                      ← override examples
│   │   ├── PRIORITY_RUBRIC.md                ← P0/P1/P2 auto-balancing
│   │   └── TIMELINE_ESTIMATES.md
│   │
│   ├── 06-templates/                         ← artifact templates
│   │   ├── TEMPLATE_test_case.md
│   │   ├── TEMPLATE_uat_script.md
│   │   ├── TEMPLATE_runbook.md
│   │   ├── TEMPLATE_support_playbook.md
│   │   └── TEMPLATE_compliance_control.md
│   │
│   ├── 07-agents/                            ← 18 agent personalities
│   │   ├── AGENT_orchestrator.md             (A00) — the conductor
│   │   ├── AGENT_discovery.md                (A01) — software archaeologist
│   │   ├── AGENT_domain_mapping.md           (A02) — DDD lead
│   │   ├── AGENT_tooling_discovery.md        (A03) — DevOps architect
│   │   ├── AGENT_engineering_unit.md         (A04) — test engineer
│   │   ├── AGENT_engineering_integration.md  (A05) — integration lead
│   │   ├── AGENT_security.md                 (A06) — OWASP expert
│   │   ├── AGENT_performance.md              (A07) — perf architect
│   │   ├── AGENT_accessibility.md            (A08) — WCAG specialist
│   │   ├── AGENT_chaos.md                    (A09) — chaos lead
│   │   ├── AGENT_business_analyst.md         (A10) — senior BA
│   │   ├── AGENT_uat.md                      (A11) — QA manager
│   │   ├── AGENT_runbook.md                  (A12) — staff SRE
│   │   ├── AGENT_alerting.md                 (A13) — observability lead
│   │   ├── AGENT_support_triage.md           (A14) — support architect
│   │   ├── AGENT_customer_comms.md           (A15) — CX writer
│   │   ├── AGENT_compliance.md               (A16) — compliance director
│   │   ├── AGENT_risk.md                     (A17) — CRO-style
│   │   └── AGENT_quality_council.md          (QC) — 4 judges
│   │
│   ├── 08-protocols/                         ← inter-agent contracts
│   │   ├── AGENT_PROTOCOL.md
│   │   ├── AUDIT_TRAIL.md
│   │   ├── CHUNKING_PROTOCOL.md
│   │   ├── CITATIONS.md                      ← 100% verification rules
│   │   ├── CONDITIONAL_CONTINUE.md           ← user reply format
│   │   ├── COVERAGE_LEDGER.md                ← dedup & cross-layer tracking
│   │   ├── ARTIFACT_STATUS.md                ← 7 status values
│   │   ├── HANDOFF_PROTOCOL.md
│   │   ├── QUALITY_GATES.md
│   │   ├── ROOT_CAUSE_GROUPING.md
│   │   ├── TEST_FIXTURES.md                  ← seed SQL + teardown
│   │   └── UNIVERSAL_AGENT_DISCIPLINE.md     ← U1-U6 rules
│   │
│   └── 99-reference/
│       ├── CHEATSHEET.md                     ← quick command reference
│       ├── FAILURE_RULES.md                  ← error recovery patterns
│       ├── GLOSSARY.md                       ← plain-language guide
│       ├── ID_SCHEMES.md                     ← naming conventions
│       └── V1_TO_V2_MIGRATION.md
│
├── Skill/
│   └── praetor.skill                         ← Claude Code integration
│
└── .claude/
    └── settings.local.json                   ← local configuration

```

---

## Key Features

### Multi-Agent Orchestration
- **18 specialists** working in parallel, each with declared persona and authority
- Domain experts in QA, security, performance, operations, support, and compliance

### Quality Assurance
- **4-judge Quality Council** reviews every artifact before emission:
  - Judge 1: Coverage completeness
  - Judge 2: Citation verification (100% file:line claims re-verified)
  - Judge 3: Clarity & readability
  - Judge 4: Skip-validity (are deferred items justified?)

### Citation Verification
- **100% verified file:line traceability** — every claim is independently re-opened and confirmed
- No phantom references to code that doesn't exist

### Intelligent Deduplication
- **Layer-aware Coverage Ledger** distinguishes:
  - `DUPLICATE_OF_<id>` — same layer, exact match
  - `RELATED_TO_<id>` — cross-layer concern that connects to another finding

### Tooling Adaptation
- **Stack detection** — recognizes Datadog, Prometheus, Sentry, PagerDuty, etc.
- **Format adaptation** — emits alerts, dashboards, and runbooks in your native syntax
- **Fallback to generic** — if nothing detected, provides generic + adoption guide

### Conditional Gating
- **Phase 3 MUST CONFIRM** — structured user input before full execution
- **Partial answers supported** — answer what you know, mark unknowns
- **Override commands** — limit to specific modules, priorities, or categories

### Regression Prevention
- **Phase 6 ties fixes to gates** — every CRITICAL/HIGH fix links to:
  - CI gate (prevent regression)
  - Alert spec (detect return)
  - Runbook (respond fast)

---

## Running Modes

Override `RUN_PHASES`, `RUN_CATEGORIES`, `RUN_PRIORITIES`, and `RUN_MODULES` to customize:

| Goal | Override |
|---|---|
| **Full run** (default) | (no override) |
| **Discovery only** | `RUN_PHASES = [0,1,2,3]` |
| **P0 critical readiness** | `RUN_PRIORITIES = [P0]` |
| **Under-resourced triage** | `RUN_CATEGORIES = [B,C,D]`, `RUN_PRIORITIES = [P0]` |
| **Single critical module** | `RUN_MODULES = [M_PAYMENTS]` |
| **Compliance audit prep** | `RUN_CATEGORIES = [E]` |
| **Engineering only** | `RUN_CATEGORIES = [A]` |

---

## The 18 Agents

### Tier 1 — Discovery
- **A01 Discovery** (20y) — Principal Software Archaeologist
- **A02 Domain Mapping** (15y) — DDD Lead  
- **A03 Tooling Discovery** (12y) — DevOps Tools Architect

### Tier 2 — Engineering Specialists
- **A04 Unit Test** (12y) — Senior Test Engineer
- **A05 Integration Test** (15y) — Integration Test Architect
- **A06 Security** (18y) — Principal Security Engineer (OWASP)
- **A07 Performance** (15y) — Performance Architect
- **A08 Accessibility** (10y) — WCAG Specialist
- **A09 Chaos** (12y) — Chaos Engineering Lead

### Tier 3 — Business & Operations
- **A10 Business Analyst** (15y) — Senior BA (MBA)
- **A11 UAT** (12y) — QA Manager
- **A12 Runbook** (15y) — Staff SRE
- **A13 Alerting** (12y) — Observability Lead

### Tier 4 — Communications & Compliance
- **A14 Support Triage** (12y) — Support Architect
- **A15 Customer Comms** (10y) — CX Writer
- **A16 Compliance** (18y) — Compliance Director (SOC2/GDPR)
- **A17 Risk** (15y) — Chief Risk Officer-style

### Quality Layer
- **QC Quality Council** — 4 judges (Coverage / Correctness / Clarity / Skip-Validity)

---

## What Praetor Does NOT Do

- ❌ Execute the generated tests (you/your CI run them)
- ❌ Deploy fixes
- ❌ Send customer communications  
- ❌ File tickets automatically
- ❌ Replace human review

**It produces the specifications. Your team executes them.**

---

## By the Numbers

| Aspect | Count |
|---|---|
| Phases | 7 |
| Audience categories | 5 |
| Register types | 12 |
| Autonomous agents | 18 |
| Quality Council judges | 4 |
| Inter-agent protocols | 12 |
| Artifact STATUS values | 7 |
| Total documentation files | 67+ |

---

## Documentation Guide

### For First-Time Users
1. Start with **`GLOSSARY.md`** — plain-language definitions of all jargon
2. Read **`AGENT_ROSTER.md`** — meet all 18 agents
3. Paste **`MASTER_PROMPT.md`** into Claude

### For Operators
- **`CHEATSHEET.md`** — quick command reference for overrides and modes
- **`CONDITIONAL_CONTINUE.md`** — how to reply at Phase 3 gate

### For Implementers
- **`AGENT_PROTOCOL.md`** — inter-agent communication rules
- **`UNIVERSAL_AGENT_DISCIPLINE.md`** — U1-U6 rules every agent obeys
- **`QUALITY_GATES.md`** — what passes Quality Council review

### For Auditors & Compliance
- **`AUDIT_TRAIL.md`** — how to verify artifact provenance
- **`CITATIONS.md`** — 100% verification protocol
- **`COVERAGE_LEDGER.md`** — deduplication & cross-layer tracking

---

## Version

**Current Version:** 2.3 (operational quality release)

See **`VERSION.md`** for release history, new features, and breaking changes.

---

## License & Attribution

Praetor is a prompt artifact. Use it, modify it, share it with your teams.  
Attribution appreciated but not required.

---

## Support & Feedback

For issues, questions, or improvements:
- Check **`FAILURE_RULES.md`** for common error scenarios
- Review **`GLOSSARY.md`** if terminology is unclear  
- Consult relevant **`AGENT_*.md`** files for agent-specific behavior

---

**One prompt. Eighteen experts. Six disciplines. Full traceability.**
