<!-- Praetor — Production Readiness Audit Skill
     Copyright (c) 2026 Mohamed Elharery (https://github.com/Harery). All rights reserved.
     Project repository: https://github.com/Harery/Praetor
     Licensed under the MIT License; see LICENSE at the repository root. -->

# Operator's Cheat Sheet (v2.8.6)

## Quick-Start
1. Open a session with your AI agent (the Praetor skill triggers on phrases like "audit my code",
   "production readiness", "security review" — or name Praetor directly).
2. Provide the source: `Source: <github URL | local path | attached files>`.
3. Optionally append a RUN CONFIGURATION block (see recipes below).
4. Wait for the Discovery Report (includes Audit Trail + MUST CONFIRM block).
5. Reply per CONDITIONAL_CONTINUE protocol.
6. After each module, reply `continue` or `continue module` (chunked).
7. Wrap-up emits automatically after final module.

## The Roster at a Glance (A00 + 17 specialists + Quality Council)
```
A00 Orchestrator         — routes, sequences, quality-gates (the persona you talk to)
A01 Discovery            — technical archaeologist
A02 Domain Mapping       — builds 12 registers, enforces priority distribution
A03 Tooling Discovery    — detects org tools, adapts output format
A04 Unit Test            — per-function branch coverage
A05 Integration Test     — API, middleware, data, contract tests
A06 Security             — OWASP, vetoes critical findings, secret scan + secret-lint
A07 Performance          — emits k6/artillery scripts
A08 Accessibility        — WCAG 2.1 AA (only if frontend)
A09 Chaos                — fuzz + network/process/clock chaos
A10 Business Analyst     — plain-language BR matrices
A11 UAT                  — click-by-click scripts
A12 Runbook              — 3am-grade SRE content
A13 Alerting             — signal-to-noise tuned alerts
A14 Support Triage       — decision trees, error translations
A15 Customer Comms       — brand-safe templates
A16 Compliance           — control mapping, PII flows
A17 Risk                 — consolidated risk register
QC  Quality Council      — 4 judges (Coverage / Correctness / Clarity / Skip-Validity)
```

## Artifact Status Tags (common subset)
Full set — 7 core + extended — is in `references/protocols/ARTIFACT_STATUS.md`.
The ones you'll see most:
```
READY                       — execute / adopt / file as-is
READY_EXPOSES_BUG           — test is correct; current code will fail it
INFERRED                    — depends on inferred register entry
BLOCKED_BY_MISSING_CODE     — references absent code
DUPLICATE_OF_<id>           — covered elsewhere (same layer)
RELATED_TO_<id>             — same scenario, different layer
DEFERRED_TO_<x>             — out of scope this run
NO_WORK_FOUND               — scope analyzed, nothing applicable (Judge 4 checks)
QC_FAILED                   — failed a Quality Council judge
```
Risk entries (`RR-`) use a separate lifecycle: OPEN/MITIGATING/MITIGATED/ACCEPTED/CLOSED.

## Gate Reply Formats
```
continue
continue with: Q1=..., Q2=unknown, Q3=...
correct: <list of corrections> then continue
override: RUN_X = [...] then continue
halt                         (emits a Resumable Snapshot you can paste back later)
<any question>               (answered in place; gate re-shown — NOT a halt,
                              no snapshot, no state loss)
```

## Run-Mode Recipes (append a RUN CONFIGURATION block to your message)
| Goal | Block |
|---|---|
| Discovery only | `RUN_PHASES = [0,1,2,3]` |
| P0 readiness floor | `RUN_PRIORITIES = [P0]` |
| Under-resourced triage | `RUN_CATEGORIES = [B,C,D]`, `RUN_PRIORITIES = [P0]` |
| One critical module | `RUN_MODULES = [M_PAYMENTS]` |
| Compliance audit prep | `RUN_CATEGORIES = [E]` |

> These 5 are the most common. Full set of **10 recipes** (Business Package,
> Ops Hardening, Pre-Release Smoke, Support KB Refresh, New Feature Drop, …):
> `references/execution/RUN_MODES.md`.

## Team & Time
- P0-only, 10 modules: 5 people, 4 business days
- Full, 15 modules: 11 people, 4 weeks
- Single audience, 15 modules: 2 people, 2 weeks

> Reminder: agents are sequentially-simulated personas in one context, not
> parallel processes. A "full, 15 modules" run takes many `continue` turns.

## Don't Do This
- Skip the Phase 3 gate (the MUST CONFIRM block depends on it)
- Have one person review all five audiences
- Try P0+P1+P2 across 30 modules in a one-week sprint
- Treat INFERRED items as facts (gate exists for this reason)
- Ignore QC_FAILED tags on emit
- Treat the Citations Index as externally certified — it's re-derived; spot-check it

> QC rework is **one shot, total**: an agent fixes only the flagged judge's
> concern. If a second judge flags a new issue on the reworked artifact, it
> still emits `QC_FAILED` — the single rework is consumed (it is not one
> rework per judge).
