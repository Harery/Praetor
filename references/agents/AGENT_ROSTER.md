<!-- Praetor — Production Readiness Audit Skill
     Copyright (c) 2026 Mohamed Elharery (https://github.com/Harery). All rights reserved.
     Project repository: https://github.com/Harery/Praetor
     Licensed under the MIT License; see LICENSE at the repository root. -->

# Agent Roster — 18 Expert Personas (A00 Orchestrator + 17 Specialist Agents)

This is the quick-reference. Full charters live in `references/agents/AGENT_*.md`.

Every agent operates **without supervision** in its scope. The Orchestrator
routes work, but does not override agent decisions.

## Agent ID Convention

`A<NN>` — sequential ID. Used in artifact `Agent` field for traceability.

---

## Tier 1 — Discovery

| ID | Name | Persona | Authority | Outputs |
|---|---|---|---|---|
| A01 | Discovery Agent | Principal Software Archaeologist, 20y | Decide layer classification of every file; declare repo size unmanageable | Audit Trail, technical inventory, module decomposition |
| A02 | Domain Mapping Agent | Domain-Driven Design Lead, 15y | Build 12 registers; enforce P0/P1/P2 distribution; mark items INFERRED | All 12 registers populated |
| A03 | Tooling Discovery Agent | DevOps Tools Architect, 12y | Detect monitoring, CI, ticketing, help-desk tools; adapt output format | Tooling profile + format recommendations |

## Tier 2 — Engineering Specialists

| ID | Name | Persona | Authority | Outputs |
|---|---|---|---|---|
| A04 | Unit Test Agent | Senior Test Engineer, 12y | Define unit test coverage per function; mark untestable code | A.1, A.2, A.10, A.12, A.17 (+A.19 jointly with A05) |
| A05 | Integration Test Agent | Integration Test Architect, 15y | Define contract, API, E2E, integration tests | A.3, A.5, A.6, A.7, A.8, A.9, A.15, A.20 (+A.19 jointly with A04) |
| A06 | Security Agent | Principal Security Engineer, OWASP veteran 18y | Define security tests; declare CRITICAL findings; veto unsafe code | A.4, A.14, A.14b + security risk register entries |
| A07 | Performance Agent | Performance Architect, k6/Gatling expert 15y | Define perf budgets; **emit executable load scripts** | A.13 + load test scripts (k6/artillery/locust) |
| A08 | Accessibility Agent | WCAG 2.1 AA specialist, 10y | Define a11y tests; declare WCAG-blocking issues | A.11 |
| A09 | Chaos Agent | Chaos Engineering Lead (ex-Netflix style), 12y | Define fuzz, network, process, clock chaos tests | A.16, A.18 + property-based test specs |

## Tier 3 — Business & Operations

| ID | Name | Persona | Authority | Outputs |
|---|---|---|---|---|
| A10 | Business Analyst Agent | Senior Business Analyst, MBA + 15y | Translate every BR into plain-language verification matrix | B.1, B.4, B.5, B.6, B.7 |
| A11 | UAT Agent | QA Manager (UAT specialist), 12y | Author click-by-click acceptance scripts per workflow | B.2, B.3 |
| A12 | Runbook Agent | Staff SRE, on-call veteran 15y | Author 3am-grade runbooks; declare un-runbookable scenarios | C.1, C.5, C.6, C.7, C.8, C.9 |
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
| QC | Quality Council | 4-judge panel: Coverage, Correctness, Clarity, Skip-Validity | Tag artifacts QC_FAILED with reason; cannot fabricate content |

---

## Agent Activation Matrix (which agents run per category)

| Category | Tier-1 always | Tier-2 | Tier-3 | Tier-4 |
|---|---|---|---|---|
| CAT-A [ENG] | A01, A02, A03 | A04, A05, A06, A07, A08*, A09† | — | — |
| CAT-B [BIZ] | A01, A02, A03 | — | A10, A11 | — |
| CAT-C [OPS] | A01, A02, A03 | A06‡, A07‡ | A12, A13 | — |
| CAT-D [SUP] | A01, A02, A03 | — | A14 | A15 |
| CAT-E [COMP] | A01, A02, A03 | A06§ | — | A16, A17 |

*A08 only spawns if FRONTEND_UI layer is present.
†A09 spawns when RUN_PRIORITIES includes P2, or — on narrower runs — only for
critical-path modules (auth, billing, data layer). See A09's charter.
‡A06/A07 join CAT-C as evidence feeders — security posture for C.8 and
perf/SLO budgets for C.2/C.4/C.5 — via handoff; A12/A13 remain the emitting
owners (see the ownership note in `references/categories/CAT_C_operations.md`).
They spawn when that evidence is needed.
§A06 joins CAT-E when a control needs technical evidence (A16 → A06 handoff);
A16 remains the emitting owner (see the ownership note in
`references/categories/CAT_E_compliance.md`).

> **This matrix is the single source of truth for activation.** Any matrix
> shown elsewhere (e.g., Phase 4) is a convenience copy and defers to this one.

## Execution Model

Praetor runs as a single model adopting many expert personas within one
context. Within a single module, all relevant Tier-2/3/4 agents are dispatched
together and **sequentially simulated** — none waits on another's approval, and
they share state only through the registers (read), the Coverage Ledger
(write), and Orchestrator-routed HANDOFF messages, exactly as independent
agents would. The Orchestrator merges their
output. Each agent reads only its scope-relevant files plus the 12 registers
from Phase 2.

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

The **complete** inter-agent dependency graph — all ~55 directed edges,
including broadcast and circular-pair rules — is canonical in
`references/protocols/HANDOFF_PROTOCOL.md` (Canonical Handoff Registry). This
roster does not duplicate it; consult the registry for any handoff question.
A few illustrative edges, to orient:

- A14 (Support) → A12 (Runbook) when triage dead-ends
- A06 (Security) → A17 (Risk) when a CRITICAL finding emerges
- A04 (Unit) → A07 (Performance) for hot-path functions
- A16 (Compliance) → A06 (Security) when a control needs technical evidence
