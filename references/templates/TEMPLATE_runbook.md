<!-- Praetor — Production Readiness Audit Skill
     Copyright (c) 2026 Mohamed Elharery (https://github.com/Harery). All rights reserved.
     Project repository: https://github.com/Harery/Praetor
     Licensed under the MIT License; see LICENSE at the repository root. -->

# Template — Runbook `[OPS]`

```
| RB ID                | RB-M_PAYMENTS-PROVIDER_OUTAGE-001                |
| Audience             | [OPS]                                            |
| Status               | READY                                            |
| Agent                | A12                                              |
| Priority             | P0                                               |
| Linked IDs           | DEP-001 (Stripe), ERR-201 (provider 5xx), SLO-003 (checkout success ≥99%) |
| Trigger              | Alert: payment_provider_error_rate > 5% for 5 min |
| Likely Causes        | 1. Provider outage <br> 2. Our API key rotated incorrectly <br> 3. Network egress issue |
| Diagnostics          | 1. Check status.stripe.com <br> 2. `grep -i "stripe" /var/log/app.log \| tail -100` <br> 3. Query: `SELECT COUNT(*) FROM payment_attempts WHERE created_at > NOW()-INTERVAL '5 min' AND status='failed'` |
| Mitigation Steps     | 1. If Stripe outage confirmed, toggle feature flag `FEATURE_BACKUP_PROCESSOR` to ON <br> 2. Post status page update via /admin/status <br> 3. Notify support via #support-incident channel <br> 4. Monitor success rate for 15 min |
| Rollback             | Toggle `FEATURE_BACKUP_PROCESSOR` back to OFF once primary provider recovers |
| Escalation Path      | If mitigation fails within 30 min → Page Engineering Lead (P1). If revenue impact > $10k/hr → Page CTO. |
| Post-Incident Notes  | File template at /docs/incidents/template.md; include: timeline, customer impact, root cause, action items. |
| Open Items           | (optional) Unverified references awaiting human confirmation, per A12 Rule 6 — e.g., [CONFIRM EXISTS: /docs/oncall-rotation.md] |
```

## Conventions

- 3am on-call standard: every step must be executable without prior context.
- Diagnostic commands use copy-paste-ready syntax.
- Escalation path names roles, not individuals (those rotate).
- Mitigation steps are ordered and atomic — each can be done or skipped independently.
