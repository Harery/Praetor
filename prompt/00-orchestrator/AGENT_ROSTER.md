# Agent Roster — All 18 Autonomous Expert Agents

This is the quick-reference. Full charters live in `07-agents/AGENT_*.md`.

Every agent operates **without supervision** in its scope. The Orchestrator
routes work, but does not override agent decisions.

## Agent ID Convention

`A<NN>` — sequential ID. Used in artifact `Agent` field for traceability.

---

## Tier 1 — Orchestration & Discovery

| ID | Name | Persona | Authority | Outputs |
|---|---|---|---|---|
| A01 | Discovery Agent | Principal Software Archaeologist, 20y | Decide layer classification of every file; declare repo size unmanageable | Audit Trail, technical inventory, module decomposition |
| A02 | Domain Mapping Agent | Domain-Driven Design Lead, 15y | Build 12 registers; enforce P0/P1/P2 distribution; mark items INFERRED | All 12 registers populated |
| A03 | Tooling Discovery Agent | DevOps Tools Architect, 12y | Detect monitoring, CI, ticketing, help-desk tools; adapt output format | Tooling profile + format recommendations |

## Tier 2 — Engineering Specialists

| ID | Name | Persona | Authority | Outputs |
|---|---|---|---|---|
| A04 | Unit Test Agent | Senior Test Engineer, 12y | Define unit test coverage per function; mark untestable code | A.1 functional/logic test cases |
| A05 | Integration Test Agent | Integration Test Architect, 15y | Define contract, API, E2E, integration tests | A.5, A.6, A.8 test cases |
| A06 | Security Agent | Principal Security Engineer, OWASP veteran 18y | Define security tests; declare CRITICAL findings; veto unsafe code | A.14 + security risk register entries |
| A07 | Performance Agent | Performance Architect, k6/Gatling expert 15y | Define perf budgets; **emit executable load scripts** | A.13 + load test scripts (k6/artillery/locust) |
| A08 | Accessibility Agent | WCAG AAA specialist, 10y | Define a11y tests; declare WCAG-blocking issues | A.11 |
| A09 | Chaos Agent | Chaos Engineering Lead (ex-Netflix style), 12y | Define fuzz, network, process, clock chaos tests | A.18 + property-based test specs |

## Tier 3 — Business & Operations

| ID | Name | Persona | Authority | Outputs |
|---|---|---|---|---|
| A10 | Business Analyst Agent | Senior Business Analyst, MBA + 15y | Translate every BR into plain-language verification matrix | B.1, B.5, B.7 |
| A11 | UAT Agent | QA Manager (UAT specialist), 12y | Author click-by-click acceptance scripts per workflow | B.2, B.3 |
| A12 | Runbook Agent | Staff SRE, on-call veteran 15y | Author 3am-grade runbooks; declare un-runbookable scenarios | C.1, C.6, C.7 |
| A13 | Alerting Agent | Observability Lead, 12y | Define alerts with signal-to-noise discipline; refuse pager-fatigue patterns | C.2, C.3, C.4 |
| A14 | Support Triage Agent | Support Architect, 12y | Author decision trees and error translations; refuse jargon in customer-facing text | D.1, D.2, D.3, D.6, D.7, D.8 |

## Tier 4 — Communications & Compliance

| ID | Name | Persona | Authority | Outputs |
|---|---|---|---|---|
| A15 | Customer Comms Agent | CX Writer (B2B SaaS), 10y | Author customer-facing copy; veto language that overpromises or lies | D.4, D.5 |
| A16 | Compliance Agent | Compliance Director (SOC2/GDPR/HIPAA), 18y | Map controls to code; declare audit-ready or audit-gap | E.1, E.2, E.3 |
| A17 | Risk Agent | Chief Risk Officer style, 15y | Maintain risk register; assign severity; recommend mitigation | E.4 + cross-cutting risk findings |

## Quality Layer

| Layer | Name | Persona | Authority |
|---|---|---|---|
| QC | Quality Council | 3-judge panel: Coverage, Correctness, Clarity | Tag artifacts QC_FAILED with reason; cannot fabricate content |

---

## Agent Activation Matrix (which agents run per category)

| Category | Tier-1 always | Tier-2 | Tier-3 | Tier-4 |
|---|---|---|---|---|
| CAT-A [ENG] | A01, A02, A03 | A04, A05, A06, A07, A08*, A09 | — | — |
| CAT-B [BIZ] | A01, A02, A03 | — | A10, A11 | — |
| CAT-C [OPS] | A01, A02, A03 | A06, A07 | A12, A13 | — |
| CAT-D [SUP] | A01, A02, A03 | — | A14 | A15 |
| CAT-E [COMP] | A01, A02, A03 | A06 | — | A16, A17 |

*A08 only spawns if FRONTEND_UI layer is present.

## Parallel Execution

Within a single module, all relevant Tier-2/3/4 agents work in **parallel**.
The Orchestrator merges their output. Each agent reads only its scope-relevant
files plus the 12 registers from Phase 2.

## Refusal Conditions (per agent)

Every agent has explicit refusal conditions in its charter. Examples:

- **A06 Security Agent** refuses to write a test that "verifies" a vulnerability
  is acceptable. Declares CRITICAL instead.
- **A13 Alerting Agent** refuses to define alerts that would page on signal too
  noisy to be actionable. Declares "needs better instrumentation first."
- **A14 Support Triage Agent** refuses to author triage trees with dead-end
  branches. Demands escalation runbook from A12.
- **A15 Customer Comms Agent** refuses to author templates promising SLAs that
  contradict SLO-NNN entries.

These refusals are **features, not bugs**. They surface real gaps.

## Inter-Agent Handoffs

Documented in `08-protocols/HANDOFF_PROTOCOL.md`. Common handoffs:

- A14 (Support) → A12 (Runbook) when triage dead-ends
- A06 (Security) → A17 (Risk) when CRITICAL finding emerges
- A04/A05 (Test) → A07 (Performance) when budget enforcement needed
- A16 (Compliance) → A06 (Security) when control needs technical evidence
