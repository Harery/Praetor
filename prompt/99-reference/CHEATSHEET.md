# Operator's Cheat Sheet (v2)

## Quick-Start
1. Open Claude.
2. Paste `00-orchestrator/MASTER_PROMPT.md`.
3. Append: `Source: <github URL | local path | attached files>`.
4. Wait for Discovery Report (now includes Audit Trail + MUST CONFIRM block).
5. Reply per CONDITIONAL_CONTINUE protocol.
6. After each module, reply `continue` or `continue module` (chunked).
7. Wrap-up emits automatically after final module.

## 18 Agents at a Glance
```
A01 Discovery            — technical archaeologist
A02 Domain Mapping       — builds 12 registers, enforces priority distribution
A03 Tooling Discovery    — detects org tools, adapts output format
A04 Unit Test            — per-function branch coverage
A05 Integration Test     — API, middleware, data, contract tests
A06 Security             — OWASP, vetoes critical findings
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
QC  Quality Council      — 3 judges (Coverage / Correctness / Clarity)
```

## 5 Artifact Status Tags
```
READY                       — execute / adopt / file as-is
INFERRED                    — depends on inferred register entry
BLOCKED_BY_MISSING_CODE     — references absent code
DUPLICATE_OF_<id>           — covered elsewhere
DEFERRED_TO_<x>             — out of scope this run
```

## Gate Reply Formats
```
continue
continue with: Q1=..., Q2=unknown, Q3=...
correct: <list of corrections> then continue
override: RUN_X = [...] then continue
halt
```

## Run-Mode Recipes (paste at end of master prompt)
| Goal | Block |
|---|---|
| Discovery only | `RUN_PHASES = [0,1,2,3]` |
| P0 readiness floor | `RUN_PRIORITIES = [P0]` |
| Under-resourced triage | `RUN_CATEGORIES = [B,C,D]`, `RUN_PRIORITIES = [P0]` |
| One critical module | `RUN_MODULES = [M_PAYMENTS]` |
| Compliance audit prep | `RUN_CATEGORIES = [E]` |

## Team & Time
- P0-only, 10 modules: 5 people, 4 business days
- Full, 15 modules: 11 people, 4 weeks
- Single audience, 15 modules: 2 people, 2 weeks

## Don't Do This
- Skip Phase 3 gate (now even more important with MUST CONFIRM block)
- Have one person review all five audiences
- Try P0+P1+P2 across 30 modules in a one-week sprint
- Treat INFERRED items as facts (gate exists for this reason)
- Ignore QC_FAILED tags on emit
