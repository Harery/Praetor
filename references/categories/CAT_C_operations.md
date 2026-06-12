<!-- Praetor — Production Readiness Audit Skill
     Copyright (c) 2026 Mohamed Elharery (https://github.com/Harery). All rights reserved.
     Project repository: https://github.com/Harery/Praetor
     Licensed under the MIT License; see LICENSE at the repository root. -->

# Category C — Operations / SRE Artifacts `[OPS]`

**Audience**: Operations / SRE. **Mandate**: `references/mandates/MANDATE_operations.md`.
**Adoption time per module**: 2–6 hours by 1 SRE.
**Writing standard**: Self-contained for a 3am on-call engineer with no prior context.

## The 9 Operations Artifacts

> **Agent ownership** (who *generates* each artifact): A12 owns C.1, C.5, C.6,
> C.7, C.8, C.9; A13 owns C.2, C.3, C.4. Via handoff, A07 feeds C.5
> (bottlenecks/headroom) and the perf/SLO budgets behind C.2 and C.4, and A06
> feeds C.8 (secret posture); A12/A13 remain the emitting owners (matching the
> roster activation matrix footnote ‡).

### Group C.P0 — Must-have (5 artifacts)

| # | Title | Output |
|---|---|---|
| C.1 | Runbooks | Per failure mode in WF/SM/ERR/DEP registers |
| C.2 | Alerting Matrix | Signal → threshold → severity → channel → runbook link |
| C.4 | SLO Definitions & Error Budget Policy | Per SLO-NNN: target, window, burn-rate alerts |
| C.6 | Deployment & Rollback Checklist | Pre/post deploy verification, rollback steps |
| C.9 | Third-Party Dependency Ops Notes | Per DEP-NNN: status page, contact, SLA, fallback |

### Group C.P1 — Should-have (4 artifacts)

| # | Title | Output |
|---|---|---|
| C.3 | Monitoring Dashboard Spec | Golden signals + business KPIs + dependency health |
| C.5 | Capacity & Scaling Notes | Bottlenecks, headroom, scale triggers |
| C.7 | Disaster Recovery Drill | Failure scenario → detection → recovery → RPO/RTO |
| C.8 | Access, Secrets, Rotation | Per CFG-NNN: storage, access, rotation cadence |

## Runbook Format

```
| RB ID | Trigger (alert / symptom) | Likely causes | Diagnostics (commands/queries) | Mitigation (ordered steps) | Rollback | Escalation path | Post-incident notes |
```

## Alerting Matrix Format

```
| AL ID | Signal source | Pattern | Threshold | Severity | Channel | Runbook | Suppression |
```

## See Also

- `references/templates/TEMPLATE_runbook.md`
