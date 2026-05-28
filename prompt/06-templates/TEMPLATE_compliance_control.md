# Template — Compliance Control Mapping `[COMP]`

## E.1 Control Mapping

```
| CM ID                  | CM-SOC2-CC6.1-001                                  |
| Audience               | [COMP]                                             |
| Priority               | P0                                                 |
| Framework              | SOC2                                               |
| Control #              | CC6.1                                              |
| Control Description    | The entity implements logical access security software, infrastructure, and architectures over protected information assets. |
| Implementation Location| src/auth/middleware.ts:42-89 (JWT verification middleware applied to all protected routes); src/auth/rbac.ts (role check decorators) |
| Test Evidence          | TC-M_AUTH-MIDDLEWARE-JWT_VERIFY-001 through 005; TC-M_AUTH-RBAC-ENFORCE-001 through 012 |
| Gap Notes              | No automated test for token revocation propagation across distributed cache; manual quarterly verification documented in /docs/quarterly-access-review.md |
```

## E.3 PII Data Flow

```
| PRV ID       | Data Type     | PII Class | Storage Location           | Encryption     | Retention            | Erasure Path                     | Lawful Basis (GDPR)        |
| PRV-001      | email         | Basic     | users.email (PostgreSQL)   | At rest (TDE)  | Account lifetime+30d | DELETE /api/users/me triggers job | Contract performance       |
| PRV-002      | name          | Basic     | users.full_name            | At rest (TDE)  | Account lifetime+30d | DELETE /api/users/me              | Contract performance       |
| PRV-003      | payment_method| Sensitive | Vault by Stripe (not us)   | Tokenized      | Per Stripe retention | Stripe API: detach token          | Legitimate interest        |
| PRV-004      | chat_history  | Basic     | messages table             | At rest (TDE)  | 90 days rolling      | Automated purge job (cron)        | Contract performance       |
```

## E.4 Risk Register Entry

```
| Risk ID | RR-M_USERS-001                                                  |
| Title   | Admin user export endpoint lacks rate limiting                  |
| Severity| HIGH (data exposure × elevated privilege)                        |
| Likelihood | LOW (admin-only access)                                        |
| Impact  | A compromised admin account could exfiltrate full user table   |
| Owner   | Engineering (M_USERS module)                                    |
| Current Mitigation | Admin role gated; audit log of exports                  |
| Recommended Mitigation | Add per-admin rate limit; require step-up auth for >1k row exports |
| Target Date | Q3                                                          |
```

## Conventions

- Auditor-facing: every claim is traceable to source.
- `file:line` references are exact, not approximate.
- Test evidence references real TC IDs that exist in `[ENG]` artifacts.
- Gap notes are honest — pretending a gap doesn't exist creates audit risk.
