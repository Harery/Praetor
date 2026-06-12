<!-- Praetor — Production Readiness Audit Skill
     Copyright (c) 2026 Mohamed Elharery (https://github.com/Harery). All rights reserved.
     Project repository: https://github.com/Harery/Praetor
     Licensed under the MIT License; see LICENSE at the repository root. -->

# Mandate — Operations / SRE Audience `[OPS]`

## Mandate Statement

Operations owns **production availability, alerting, runbooks, and disaster
recovery**. They consume `[OPS]` artifacts directly into their tooling and
on-call processes.

## Scope of Authority

- All `[OPS]` artifacts produced in Category C.
- Alert thresholds and severity classifications.
- SLO targets and error budget policies.
- DR procedures and RPO/RTO commitments.
- Third-party dependency escalation and fallback policies.

## Hard Responsibilities

1. Validate SLO and dependency registers at the Phase 3 gate.
2. Install runbooks (C.1) into the on-call documentation system within 5
   business days of generation.
3. Wire alerts (C.2) into the monitoring stack with the specified thresholds
   and channels.
4. Run DR drills (C.7) at the cadence specified per module (minimum quarterly
   for P0 modules), and chaos drills from A09's test specs for P0 modules at
   the same cadence — coordinated, since both exercise failure paths.
5. Maintain the dependency status board (C.9).

## Boundaries (Out of Scope)

- Ops does **not** write feature code or unit tests.
- Ops does **not** define business rules — they enforce uptime regardless of rules.
- Ops does **not** speak directly to customers — that's SUP's role.

## Inputs Expected

- Monitoring stack access (Prometheus/Datadog/Grafana/Splunk/etc.).
- On-call rotation system access (PagerDuty/Opsgenie/etc.).
- Infrastructure-as-code repo access.
- Third-party vendor contacts and SLAs.

## Outputs Expected

- Runbooks live in on-call documentation, indexed by alert name.
- Alerts firing in monitoring with linked runbook URLs.
- SLO dashboard reflecting current burn rate.
- Quarterly DR drill report per P0 module.

## Definition of Done

- Every P0 failure mode identified in `WF`/`SM`/`ERR`/`DEP` has a runbook.
- Every P0 alert in the matrix is wired and tested (synthetic firing).
- Every P0 SLO has both fast-burn and slow-burn alerts.
- Every P0 dependency has a documented fallback or accepted-risk note.
- Master Traceability Matrix shows GREEN for `[OPS]` on all P0 entries.

## Plain-Language Promise

Runbooks are written for a 3am on-call engineer with no prior context. If a
runbook requires reading code to execute, file a quality issue.

## Escalation Paths

| Issue | Escalate to |
|---|---|
| Runbook step requires code change | Engineering |
| SLO target is unrealistic | Business + Leadership |
| Dependency has no viable fallback | Business + Engineering (architectural decision) |
| Recurring P0 alert firing | Engineering for root-cause; Coordinator for re-run |

## Time Reality

- Runbook install per module: ~2 hours.
- Alert wiring per module: ~3 hours.
- DR drill (full procedure): ~4 hours + 1 hour debrief.
- Quarterly per-module maintenance: ~4 hours.
- Annual time budget per SRE: ~120 hours for a 10-module platform.

## Anti-Patterns

- Copying runbooks into a wiki and never testing they actually work.
- Wiring alerts without a linked runbook (creates pager fatigue).
- Skipping DR drills because "nothing has gone wrong yet."
- Treating third-party dependency fallback as theoretical; not actually testable.
