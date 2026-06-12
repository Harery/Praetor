# Category A — Engineering & QA Artifacts `[ENG]`

**Audience**: Engineering / QA. **Mandate**: `04-mandates\/MANDATE_engineering.md`.
**Adoption time per module**: 4–16 hours by 1–2 engineers.

## The 20 Engineering Test Types

### Group A.P0 — Must-have (10 types + the A.14b sub-type — 11 table rows)

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
| A.14b | Secret Scan & Secret-Lint | Masked findings table + runnable CI stage (sub-type of A.14; see `04-mandates\/SECRET_SCAN_MANDATE.md`) |
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
| TC ID | Audience | Priority | Status | Agent | Layer | Component | Linked IDs | Description | Pre-conditions & Scope | Steps | Expected Result | Type |
```

(`ROOT_CAUSE` is an optional additional column — present only on artifacts
that expose bugs, per `08-protocols\/ROOT_CAUSE_GROUPING.md`.)

`Type` values: unit | integration | contract | e2e | api | middleware | data |
frontend | a11y | i18n | perf | load | security | observability | reliability |
chaos | fuzz | regression | smoke | fixture

(`fixture` is the Type for A.20 artifacts — test-data strategy and FX seed
specifications; `data` remains A.9's data-layer tests.)

## Retention-Enforcement Note (A.9)

For every PRV-NNN register entry with a numeric retention period (e.g.,
"90 days rolling", "account lifetime + 30 days"), A.9 Data Layer Tests
include one test verifying the purge mechanism actually exists and fires —
the cron job, TTL index, or scheduled query that deletes expired rows. A
declared retention policy with no testable purge path is emitted as
`READY_EXPOSES_BUG` (the test asserts the purge; today's code will fail it)
and handed to A17 as a privacy risk.

## Test-Type Ownership Map

Every one of the 20 types (plus A.14b) has exactly one owning agent. The
roster's `Outputs` column summarizes this map; this table is canonical:

| Types | Owner |
|---|---|
| A.1, A.2, A.10, A.12, A.17 | A04 Unit Test |
| A.3, A.5, A.6, A.7, A.8, A.9, A.15, A.20 | A05 Integration Test |
| A.4, A.14, A.14b | A06 Security |
| A.13 | A07 Performance |
| A.11 | A08 Accessibility (FRONTEND_UI only) |
| A.16, A.18 | A09 Chaos |
| A.19 | A04 + A05 jointly (smoke/regression selection across both suites) |

## CI Pipeline Placement (canonical — other files defer here)

```
PR pipeline:    lint → secret-lint → typecheck → unit → integration → contract
Nightly:        + e2e + api + a11y + perf-smoke + security-scan + secret-scan(full-history) + chaos (P2)
Pre-release:    full smoke + regression set + DR drill
```
