# Category A — Engineering & QA Artifacts `[ENG]`

**Audience**: Engineering / QA. **Mandate**: `04-mandates/MANDATE_engineering.md`.
**Adoption time per module**: 4–16 hours by 1–2 engineers.

## The 20 Engineering Test Types

### Group A.P0 — Must-have (10 types)

| # | Title | Focus |
|---|---|---|
| A.1 | Functional & Logic Scenarios | Branches, state mutations, lifecycle, async |
| A.2 | Business Rule & Invariant Code Tests | Positive / negative / boundary per BR & INV |
| A.3 | Workflow & State-Machine Tests | Every transition, guards, idempotency, resumability |
| A.4 | Role & Permission Tests | Allowed / forbidden / cross-tenant / token tampering |
| A.6 | API & Contract Tests | Schema, status codes, headers, versioning, backward compat |
| A.7 | Middleware Tests | Order, short-circuit, mutations, errors, rate limit, CORS, auth |
| A.9 | Data Layer Tests | Constraints, multi-tenancy, transactions, concurrency, migrations |
| A.14 | Security Tests | AuthN, AuthZ, injection, XSS, CSRF, SSRF, secrets, OWASP Top 10 |
| A.15 | Observability Validation | Logs / metrics / traces / audit events fire as expected |
| A.17 | Edge Cases & Lifecycle Abuse | Boundaries, races, scope leaks, recovery |

### Group A.P1 — Should-have (7 types)

| # | Title | Focus |
|---|---|---|
| A.5 | E2E Workflows | UI → client → middleware → controller → service → repo → DB → UI |
| A.8 | Integration Tests | Timeout, retry, circuit breaker, DLQ, webhooks, schema evolution |
| A.10 | Frontend Tests | Render, events, forms, routing, states, responsive, cross-browser |
| A.11 | Accessibility | WCAG 2.1 AA, keyboard, screen reader, contrast, focus |
| A.13 | Performance | Latency budgets, N+1, bundle size, LCP/CLS/TTI, cold start |
| A.16 | Reliability & Resilience | Retries, graceful shutdown, probes, DR, kill-switch |
| A.19 | Regression & Smoke Selection | Smoke set; regression tied to past bugs (CHANGELOG, "fix:" commits) |

### Group A.P2 — Standard (3 types)

| # | Title | Focus |
|---|---|---|
| A.12 | Internationalization | i18n coverage, RTL, date/time/currency, timezone |
| A.18 | Chaos / Fuzz | Property-based, network/process/clock chaos, dependency malformations |
| A.20 | Test Data & Fixtures Strategy | Factories, cleanup, sensitive data handling, seeds |

## Table Format

```
| TC ID | Audience | Priority | Layer | Component | Linked IDs | Description | Pre-conditions & Scope | Steps | Expected Result | Type |
```

`Type` values: unit | integration | contract | e2e | api | middleware | data |
frontend | a11y | i18n | perf | load | security | observability | reliability |
chaos | fuzz | regression | smoke

## CI Pipeline Placement

```
PR pipeline:    lint → typecheck → unit → integration → contract
Nightly:        + e2e + api + a11y + perf-smoke + security-scan + chaos (P2)
Pre-release:    full smoke + regression set + DR drill
```
