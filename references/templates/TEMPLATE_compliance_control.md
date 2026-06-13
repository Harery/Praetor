<!-- Praetor — Production Readiness Audit Skill
     Copyright (c) 2026 Mohamed Elharery (https://github.com/Harery). All rights reserved.
     Project repository: https://github.com/Harery/Praetor
     Licensed under the MIT License; see LICENSE at the repository root. -->

# Template — Compliance Control Mapping `[COMP]`

## E.1 Control Mapping

```
| CM ID                  | CM-SOC2-CC6.1-001                                  |
| Audience               | [COMP]                                             |
| Status                 | READY                                              |
| Agent                  | A16                                                |
| Priority               | P0                                                 |
| Linked IDs             | COMP-014 (SOC2 CC6.1 marker), BR-002 (access-control rule) |
| Framework              | SOC2                                               |
| Control #              | CC6.1                                              |
| Control Description    | The entity implements logical access security software, infrastructure, and architectures over protected information assets. |
| Implementation Location| src/auth/middleware.ts:42-89 (JWT verification middleware applied to all protected routes); src/auth/rbac.ts (role check decorators) |
| Test Evidence          | TC-M_AUTH-MIDDLEWARE-JWT_VERIFY-001 through 005; TC-M_AUTH-SEC-RBAC-001 through 012 |
| Gap Notes              | No automated test for token revocation propagation across distributed cache; manual quarterly verification documented in /docs/quarterly-access-review.md |
```

## E.3 PII Data Flow

```
PII-MAP-M_USERS-001
Audience: [COMP]
Priority: P0
Status: READY
Agent: A16
Linked IDs: PRV-001..PRV-004, COMP-003 (GDPR Art. 17 marker)

| PRV ID       | Data Type     | PII Class | Storage Location           | Encryption     | Retention            | Erasure Path                     | Lawful Basis (GDPR)        | Cross-Border         | Logged |
| PRV-001      | email         | Basic     | users.email (PostgreSQL)   | At rest (TDE)  | Account lifetime+30d | DELETE /api/users/me triggers job | Contract performance       | None (EU region only) | N      |
| PRV-002      | name          | Basic     | users.full_name            | At rest (TDE)  | Account lifetime+30d | DELETE /api/users/me              | Contract performance       | None (EU region only) | Y — see A06 redaction check |
| PRV-003      | payment_method| Sensitive | Vault by Stripe (not us)   | Tokenized      | Per Stripe retention | Stripe API: detach token          | Legitimate interest        | SCCs (Stripe US)      | N      |
| PRV-004      | chat_history  | Basic     | messages table             | At rest (TDE)  | 90 days rolling      | Automated purge job (cron)        | Contract performance       | None (EU region only) | N      |
```

## E.4 Risk Register Entry

```
| Risk ID | RR-M_USERS-001                                                  |
| Audience| [COMP] (risk register entries are cross-cutting; emitted under CAT-E) |
| Agent   | A17                                                             |
| Priority| P0                                                              |
| Linked IDs | COMP-009, PRV-001 (the control and data this risk touches)  |
| Status  | OPEN (risk-lifecycle vocabulary per `references/protocols/ARTIFACT_STATUS.md`) |
| Source Finding | TC-M_USERS-SEC-EXPORT_RATE-001 ← from A06 Security Agent (A17 Rule 3 traceability) |
| Title   | Admin user export endpoint lacks rate limiting                  |
| Severity| HIGH (data exposure × elevated privilege)                        |
| Likelihood | LOW (admin-only access)                                        |
| Impact  | A compromised admin account could exfiltrate full user table   |
| Owner   | Engineering (M_USERS module)                                    |
| Current Mitigation | Admin role gated; audit log of exports                  |
| Recommended Mitigation | Add per-admin rate limit; require step-up auth for >1k row exports — effort: 0.5–2 dev-days |
| Target Date | Q3                                                          |
```

## Conventions

- Auditor-facing: every claim is traceable to source.
- `file:line` references are exact, not approximate.
- Test evidence references real TC IDs that exist in `[ENG]` artifacts.
- Gap notes are honest — pretending a gap doesn't exist creates audit risk.
