<!-- Praetor — Production Readiness Audit Skill
     Copyright (c) 2026 Mohamed Elharery (https://github.com/Harery). All rights reserved.
     Project repository: https://github.com/Harery/Praetor
     Licensed under the MIT License; see LICENSE at the repository root. -->

# The 12 Registers — Anchor IDs for Everything

Registers are the source of truth for the entire kit. Every test, validation,
runbook, playbook, and compliance entry links back to one or more register IDs.

This file specifies the schema, source signals, and per-entry tags for each
register. Agent A02 (Domain Mapping) populates these in Phase 2.

## Universal entry fields (every register, every entry)

In addition to its register-specific schema columns below, **every** register
entry carries these four fields (shown explicitly in some schemas, implicit
in all):

- `source` — file:line or doc reference (A02 quality bar: every entry cites a source)
- `confidence` — CONFIRMED / INFERRED / ASSUMPTION / UNKNOWN, per
  `references/reference/FAILURE_RULES.md` §7
- `priority` — P0/P1/P2 per `references/execution/PRIORITY_RUBRIC.md`;
  distribution per register is band-enforced by A02 Rule 3
  (15-30% P0 / 30-50% P1 / 30-50% P2)
- `module` — owning module ID, or `platform-wide` for entries that genuinely
  span modules (common for COMP, SLO, CFG)

---

## 2.1 Business Rules — `BR-NNN`

**Schema**: `BR-ID | statement | source (file:line or doc) | module | criticality (P0/P1/P2) | confidence (CONFIRMED/INFERRED/ASSUMPTION/UNKNOWN — see references/reference/FAILURE_RULES.md §7) | owning_team_hint`

**Sources** (in A02 Rule 1's priority order — extract from explicit sources
before inferring):
1. README, /docs, ADRs, product specs
2. OpenAPI/Swagger descriptions
3. Validator definitions (zod, joi, yup, pydantic, class-validator)
4. Permission checks and policy files
5. Comments containing: must, should, cannot, always, never, only, requires
6. Error messages (they often encode the rule violated)
7. Code behavior (last resort — only with `INFERRED` tag)

**Examples**:
- "Free-tier accounts cannot exceed 100 API calls/day"
- "An invoice cannot be issued for a canceled subscription"
- "User email must be unique within a tenant"

---

## 2.2 Roles & Personas — `ROLE-NNN`

**Schema**: `ROLE-ID | name | permissions | modules_accessible | tenant_scope`

**Sources**: RBAC configs, policy files, auth middleware, user_type enums.

**Examples**: `admin`, `org_owner`, `member`, `viewer`, `support_agent`, `auditor`.

---

## 2.3 Workflows — `WF-NNN`

**Schema**: `WF-ID | name | trigger | actors (ROLE-IDs) | steps | success_criteria | failure_modes | SLA | compensating_actions`

**Sources**: Documented user flows, controller orchestration, saga patterns.

**Examples**:
- "User signup → email verification → onboarding → first action"
- "Refund request → manager approval → payment provider call → ledger update → customer notification"

---

## 2.4 State Machines — `SM-NNN`

**Schema**: `SM-ID | entity | states | allowed_transitions | guards | side_effects | terminal_states | customer_visible (Y/N)`

**Sources**: `xstate` configs, status enums + transition functions, order/subscription/account status code.

**Examples**: `subscription`, `order`, `account`, `kyc_verification`, `ticket`.

---

## 2.5 Invariants — `INV-NNN`

**Schema**: `INV-ID | statement | enforcement_location | failure_consequence`

**Sources**: Domain assertions, DB constraints (UNIQUE, CHECK, FK), domain validators.

**Examples**:
- "order.total = sum(line_items.price)"
- "user.email is unique per tenant"
- "subscription.status='active' implies payment_method_id IS NOT NULL"

---

## 2.6 Compliance Markers — `COMP-NNN`

**Schema**: `COMP-ID | framework (GDPR/PCI/HIPAA/SOC2/WCAG/...) | control_number | control_description | evidence_location`

**Sources**: Compliance docs, references to specific controls in code/comments, encryption configs, audit log code.

**Examples**:
- `GDPR Art. 17 — right to erasure → users.deleteAccount() in src/users/service.ts:142`
- `SOC2 CC6.1 — logical access controls → auth/middleware.ts`
- `PCI-DSS 3.2.1 — no storage of CVV → never stored, verified in payments/types.ts`

---

## 2.7 SLAs & SLOs — `SLO-NNN`

**Schema**: `SLO-ID | metric | target | measurement_window | source (contract/config/monitoring)`

**Sources**: Customer contracts, SLO config files, monitoring thresholds, marketing pages.

**Examples**:
- "API p99 latency < 500ms over 30 days"
- "Uptime ≥ 99.9% monthly"
- "Webhook delivery within 60s p95"

---

## 2.8 Error Catalog — `ERR-NNN`

**Schema**: `ERR-ID | code | message | http_status | trigger_condition | severity | user_facing (Y/N) | suggested_support_response`

> Runbook linkage runs in the other direction: each runbook's `Linked IDs`
> cites the ERR entries it covers, and the Phase 6 Master Traceability Matrix
> rolls up which ERR entries have runbook coverage. ERR entries are created in
> Phase 2, before any RB-ID exists, so the register itself carries no RB column.

**Sources**: Exception classes, error code enums, status code mappers, i18n error catalogs.

**Examples**:
- `ERR_PAYMENT_DECLINED` — 402 — user-facing → "Card declined; try another"
- `ERR_TENANT_LIMIT_EXCEEDED` — 429 — user-facing → "Upgrade plan or wait"
- `ERR_INTERNAL_DB_TIMEOUT` — 503 — not user-facing → on-call escalation

---

## 2.9 User-Facing Events — `UX-NNN`

**Schema** — two entry kinds share this register:
- *Events*: `UX-ID | kind=event | trigger | channel (email/in-app/SMS/push) | template_location | recipient_role`
- *Commitments* (cross-cutting UX rules per A02 Rule 6): `UX-ID | kind=commitment | statement | enforcement_location (file:line or "unenforced") | applies_to (modules/layers)`

**Sources**: Email templates, notification configs, status-change handlers;
for commitments — design docs, a11y statements, error-rendering conventions.

**Examples**:
- Welcome email on signup *(event)*
- Payment receipt on charge success *(event)*
- Password reset link *(event)*
- "Errors must be visibly shown to users, not silently swallowed" *(commitment)*
- "Destructive actions require a confirmation modal" *(commitment)*

---

## 2.10 External Dependencies — `DEP-NNN`

**Schema**: `DEP-ID | name | purpose | criticality (P0/P1/P2) | failure_impact | fallback_if_any | status_page_url | contact_path | usage (observed / declared-not-observed)`

**Sources**: SDK imports, API client classes, infrastructure configs, AND
manifest entries (package.json / requirements.txt / go.mod). A dependency in
the manifest with no import or call site in scope is still recorded, with
`usage = declared-not-observed` and confidence `INFERRED` (per A02 Rule 5b) —
it is not silently dropped.

**Examples**: Stripe, SendGrid, AWS S3, Twilio, Auth0, Datadog.

---

## 2.11 Data Retention / Privacy — `PRV-NNN`

**Schema**: `PRV-ID | data_type | PII_class (none/basic/sensitive) | storage_location (table.column / vault / external) | encryption (at-rest/tokenized/none) | retention_policy | erasure_path | lawful_basis (GDPR) | cross_border_transfers (mechanism or none) | logged (Y/N — does this field appear in log output)`

These columns map 1:1 onto the E.3 PII Map artifact
(`references/templates/TEMPLATE_compliance_control.md`), so A16 derives E.3
without inventing fields. `logged=Y` rows require an A06 redaction check
(unredacted PII in logs is CRITICAL); rows with a numeric retention period
require a purge-mechanism test (see the A.9 note in
`references/categories/CAT_A_engineering.md`).

**Sources**: Schema definitions, retention configs, GDPR endpoints, privacy
policy, log statements touching PII fields.

**Examples**:
- email, name → basic PII → kept until account deletion + 30 days → DELETE via /users/me
- DOB, SSN → sensitive PII → encrypted at rest → retained 7 years (compliance)
- chat history → basic PII → 90 days rolling

---

## 2.12 Configuration Controls — `CFG-NNN`

**Schema**: `CFG-ID | name | purpose | default | runtime_changeable (Y/N) | who_can_change`

**Sources**: `.env.example`, feature flag configs (LaunchDarkly, Unleash, in-house), runtime config files.

**Examples**:
- `MAX_API_CALLS_FREE_TIER` — default 100, changeable via admin panel
- `FEATURE_NEW_CHECKOUT` — feature flag, gradual rollout
- `STRIPE_API_KEY` — secret, infra-managed, rotation quarterly

---

## Cross-Register Linkage

Most artifacts link to **multiple** registers. Example for a test case:

```
TC-M_BILLING-SERVICE-CALCULATE_INVOICE-001
  ├── BR-007 (rounding policy)
  ├── INV-003 (total = sum of lines)
  ├── WF-012 (monthly billing cycle)
  └── SLO-002 (invoice generation < 5s)
```

This linkage powers the Master Traceability Matrix in the Phase 6 wrap-up.

## Register Entry Lifecycle (one entry, end to end)

Tracing `BR-005` ("account locks after 5 failed attempts") through a run:

1. **Phase 2 — created.** A02 extracts it from `src/auth/controller.ts:14-15`
   + README, tags `P0, CONFIRMED, M_AUTH`, links `CFG-006` (the threshold env
   var).
2. **Phase 3 — gated.** It appears in the Register Summary; had it been
   INFERRED with material impact, it would sit in the MUST CONFIRM block and
   a `continue with: Q1=…` reply would flip its confidence.
3. **Phase 4 — consumed.** A04/A05 emit `TC-…` tests linking BR-005; A10
   emits its BV row; A14 translates its lockout error. Each artifact carries
   `BR-005` in `Linked IDs`. If a cross-layer test needs a UX rule BR-005
   implies but no UX entry exists, A02 backfills via the `A02 → All` HANDOFF
   (the registers are otherwise frozen).
4. **Coverage Ledger.** Every artifact linking BR-005 lands in the Ledger;
   a module-N+1 re-test of the same scenario at the same layer becomes
   `DUPLICATE_OF_<id>`.
5. **Phase 6 — rolled up.** The Master Traceability Matrix shows BR-005's
   coverage per audience (GREEN if [ENG]+[BIZ]+[SUP] all link it); gaps go to
   the Priority-Banded Gap Report.

Every register entry follows this same path; only the consuming agents differ.

## Numbering Stability

Register IDs are **platform-wide and append-only**: business rules span
modules, so BR/WF/etc. are numbered globally (unlike per-module artifact
IDs). When modules are added or re-scoped, append new entries — never
renumber existing ones; every artifact that cites a register ID depends on
that stability.
