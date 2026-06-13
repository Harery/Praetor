<!-- Praetor — Production Readiness Audit Skill
     Copyright (c) 2026 Mohamed Elharery (https://github.com/Harery). All rights reserved.
     Project repository: https://github.com/Harery/Praetor
     Licensed under the MIT License; see LICENSE at the repository root. -->

# Template — Engineering Test Case `[ENG]`

```
| TC ID                    | TC-M_AUTH-CONTROLLER-LOGIN-001 |
| Audience                 | [ENG]                          |
| Status                   | READY                          |
| Agent                    | A05                            |
| Priority                 | P0                             |
| Layer                    | CONTROLLER                     |
| Component                | auth.login (src/auth/controller.ts:14-58) |
| Linked IDs               | BR-002, INV-001, WF-001, ERR-101 |
| Description              | Valid credentials return JWT and 200 |
| Pre-conditions & Scope   | DB seeded with user U1; rate limiter reset; clock fixed at 2026-01-01T00:00:00Z |
| Steps                    | 1. POST /login {email, password} <br> 2. Assert 200 status <br> 3. Decode JWT <br> 4. Assert sub=U1.id, exp=15min |
| Expected Result          | 200; JWT well-formed; sub matches U1.id; exp = now + 900s |
| Type                     | integration                    |
```

## Conventions

- `TC ID` format: `TC-<MODULE>-<TAG>-<SLUG>-<NNN>`, where `<TAG>` is **either**
  a canonical Layer Tag (e.g., `CONTROLLER`) **or**, for cross-cutting tests, a
  Discipline Tag (`SEC` / `A11Y` / `INT` / `PERF` / `I18N` / `CHAOS`) — see
  `references/reference/ID_SCHEMES.md`. The example above uses `CONTROLLER`
  (a Layer Tag); a security test would read `TC-M_AUTH-SEC-JWT_FALLBACK-001`.
  The `Layer` column always carries a canonical Layer Tag regardless of which
  the ID slot uses (dedup matches on the column, never the slot).
- `Linked IDs` may be empty (`—`) if no register linkage applies
- `Pre-conditions & Scope` always includes `file:line` reference to the component
- `Steps` use `<br>` for inline line breaks
- `Type` is one of: unit | integration | contract | e2e | api | middleware | data | frontend | a11y | i18n | perf | load | security | observability | reliability | chaos | fuzz | regression | smoke | fixture
