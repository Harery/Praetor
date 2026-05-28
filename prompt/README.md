# PRAETOR

> **P**roduction **R**eadiness, **A**udit, **E**vidence, **T**esting,
> **O**perations, & **R**eview

A single-prompt, multi-agent system that turns any codebase into a complete
readiness package: test cases, runbooks, alert specs, support triage trees,
customer comms, compliance evidence, and a consolidated risk register —
with full file-line traceability.

One prompt run. Six disciplines served (QA, QC, Security, Operations,
Support, Compliance). Zero hand-holding required between teams.

## What Praetor Does

Reads your repository, then dispatches 18 autonomous expert agents (each
with a 12-20 year persona, defined scope, and unilateral authority in
their domain) to produce:

| Audience | Receives |
|---|---|
| `[ENG]` Engineering & QA | Test cases (unit + integration + security + perf + a11y + chaos), executable scripts (k6, Playwright, fast-check) |
| `[BIZ]` Business | Plain-language verification matrices, UAT scripts |
| `[OPS]` Operations / SRE | 3am-grade runbooks, alert specs in detected monitoring syntax (Datadog/Prometheus/etc.) |
| `[SUP]` Support / CX | Triage decision trees, error translations, customer comm templates |
| `[COMP]` Compliance & Security | Control mappings (SOC2/GDPR/HIPAA/PCI/WCAG), PII flows, audit evidence |
| Cross-cutting | Consolidated risk register with severity, owner, dev-day estimate |

Every artifact carries a STATUS tag, an Agent attribution, linked register
IDs, and a file:line citation that's verified 100% by a 4-judge Quality
Council.

## Quick Start

1. Copy the contents of `00-orchestrator/MASTER_PROMPT.md`
2. Paste into Claude
3. Append:
   ```
   Source: <github URL | local path | uploaded files>
   ```
4. Send. Phase 0–2 run silently for ~2 minutes.
5. You receive a Discovery Report with a MUST CONFIRM block. Reply per
   the Conditional Continue protocol:
   ```
   continue with:
     Q1 = <answer>
     Q2 = unknown
   override:
     RUN_MODULES = [M_AUTH]
     RUN_PRIORITIES = [P0]
   then continue
   ```
6. Per-module outputs follow. Reply `continue` for the next module.
7. Phase 6 wrap-up emits automatically with the executive summary.

For non-technical audiences, see `99-reference/GLOSSARY.md`.
For operator commands, see `99-reference/CHEATSHEET.md`.

## Package Structure

```
praetor/
├── README.md                                 ← this file
├── VERSION.md                                ← release history
│
├── 00-orchestrator/
│   ├── MASTER_PROMPT.md                      ← THE PROMPT (paste this)
│   └── AGENT_ROSTER.md                       ← all 18 agents at a glance
│
├── 01-phases/                                ← 7 phases of the run
│   ├── PHASE_0_source_resolution.md
│   ├── PHASE_1_technical_discovery.md
│   ├── PHASE_2_domain_mapping.md
│   ├── PHASE_3_discovery_report.md
│   ├── PHASE_4_agent_swarm.md
│   ├── PHASE_5_quality_council.md
│   └── PHASE_6_wrap_up.md
│
├── 02-categories/                            ← 5 audience streams
│   ├── CAT_A_engineering.md
│   ├── CAT_B_business.md
│   ├── CAT_C_operations.md
│   ├── CAT_D_support.md
│   └── CAT_E_compliance.md
│
├── 03-registers/REGISTERS.md                 ← 12 register types (BR, ROLE, WF, etc.)
│
├── 04-mandates/                              ← per-audience deliverable charters
│   ├── MANDATE_engineering.md
│   ├── MANDATE_business.md
│   ├── MANDATE_operations.md
│   ├── MANDATE_support.md
│   └── MANDATE_compliance.md
│
├── 05-execution/
│   ├── TEAM_ASSIGNMENTS.md
│   ├── RUN_MODES.md
│   ├── PRIORITY_RUBRIC.md                    ← auto-enforced 15-30/30-50/30-50 banding
│   └── TIMELINE_ESTIMATES.md
│
├── 06-templates/                             ← artifact templates
│   ├── TEMPLATE_test_case.md
│   ├── TEMPLATE_uat_script.md
│   ├── TEMPLATE_runbook.md
│   ├── TEMPLATE_support_playbook.md
│   └── TEMPLATE_compliance_control.md
│
├── 07-agents/                                ← 18 autonomous expert agents + QC
│   ├── AGENT_orchestrator.md                 (A00)
│   ├── AGENT_discovery.md                    (A01)
│   ├── AGENT_domain_mapping.md               (A02)
│   ├── AGENT_tooling_discovery.md            (A03)
│   ├── AGENT_engineering_unit.md             (A04)
│   ├── AGENT_engineering_integration.md      (A05)
│   ├── AGENT_security.md                     (A06)
│   ├── AGENT_performance.md                  (A07)
│   ├── AGENT_accessibility.md                (A08)
│   ├── AGENT_chaos.md                        (A09)
│   ├── AGENT_business_analyst.md             (A10)
│   ├── AGENT_uat.md                          (A11)
│   ├── AGENT_runbook.md                      (A12)
│   ├── AGENT_alerting.md                     (A13)
│   ├── AGENT_support_triage.md               (A14)
│   ├── AGENT_customer_comms.md               (A15)
│   ├── AGENT_compliance.md                   (A16)
│   ├── AGENT_risk.md                         (A17)
│   └── AGENT_quality_council.md              (QC, 4 judges)
│
├── 08-protocols/                             ← inter-agent contracts
│   ├── AGENT_PROTOCOL.md
│   ├── AUDIT_TRAIL.md
│   ├── CHUNKING_PROTOCOL.md
│   ├── CITATIONS.md
│   ├── CONDITIONAL_CONTINUE.md
│   ├── COVERAGE_LEDGER.md                    ← layer-aware
│   ├── ARTIFACT_STATUS.md                    ← 7 status values
│   ├── HANDOFF_PROTOCOL.md
│   ├── QUALITY_GATES.md
│   ├── ROOT_CAUSE_GROUPING.md
│   ├── TEST_FIXTURES.md                      ← seed SQL + teardown
│   └── UNIVERSAL_AGENT_DISCIPLINE.md         ← U1-U6 rules every agent obeys
│
└── 99-reference/
    ├── CHEATSHEET.md
    ├── FAILURE_RULES.md
    ├── GLOSSARY.md                           ← plain-language jargon guide
    ├── ID_SCHEMES.md
    └── V1_TO_V2_MIGRATION.md
```

## At a Glance

| | Count |
|---|---|
| Phases | 7 |
| Audience categories | 5 |
| Register types | 12 |
| Autonomous agents | 18 |
| Quality Council judges | 4 |
| Inter-agent protocols | 12 |
| Artifact STATUS values | 7 |
| Total files | 67 |

## Core Properties

- **Multi-agent orchestration** — 18 specialists working in parallel, each with declared persona, authority, and refusal conditions
- **Quality Council review** — 4 judges (Coverage / Correctness / Clarity / Skip-Validity) review every artifact before emission
- **100% citation verification** — every file:line claim is independently re-opened and verified at emit time
- **Layer-aware deduplication** — Coverage Ledger uses `DUPLICATE_OF` for same-layer matches and `RELATED_TO` for cross-layer scenarios
- **Tooling adaptation** — detects your stack (Datadog/Sentry/Prometheus/etc.) and emits artifacts in the matching syntax
- **Tool-agnostic** — if nothing detected, emits generic format with adoption recommendations
- **Conditional gating** — Phase 3 MUST CONFIRM block; partial answers supported; structured override commands
- **Root cause grouping** — multiple symptom tests share an RC-ID so bug counts don't inflate
- **Regression prevention** — Phase 6 ties every CRITICAL/HIGH fix to a CI gate + alert + runbook
- **Test fixtures included** — every test ships with seed SQL and teardown

## What Praetor Does Not Do

- ❌ Execute the generated tests (you/your CI run them)
- ❌ Deploy fixes
- ❌ Send customer communications
- ❌ File tickets automatically
- ❌ Replace human review

It produces the specifications. Your team executes them.

## Running Modes

| Goal | Override |
|---|---|
| Full run (default) | (no override) |
| Discovery only | `RUN_PHASES = [0,1,2,3]` |
| P0 readiness floor | `RUN_PRIORITIES = [P0]` |
| Under-resourced triage | `RUN_CATEGORIES = [B,C,D]`, `RUN_PRIORITIES = [P0]` |
| Single critical module | `RUN_MODULES = [M_PAYMENTS]` |
| Compliance audit prep | `RUN_CATEGORIES = [E]` |

## License & Attribution

The Praetor system is a prompt artifact. Use it, modify it, share it with
your teams. Attribution appreciated but not required.

---

**One prompt. Eighteen experts. Six disciplines. Full traceability.**
