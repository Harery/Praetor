# The 12 Registers — Anchor IDs for Everything

Registers are the source of truth for the entire kit. Every test, validation,
runbook, playbook, and compliance entry links back to one or more register IDs.

This file specifies the schema, source signals, and per-entry tags for each
register. Claude populates these in Phase 2.

---

## 2.1 Business Rules — `BR-NNN`

**Schema**: `BR-ID | statement | source (file:line or doc) | module | criticality (P0/P1/P2) | confidence (CONFIRMED/INFERRED) | owning_team_hint`

**Sources**:
- README, /docs, ADRs, product specs
- Validator definitions (zod, joi, yup, pydantic, class-validator)
- Comments containing: must, should, cannot, always, never, only, requires
- Error messages (they often encode the rule violated)
- Permission checks and policy files

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

**Sources**: Exception classes, error code enums, status code mappers, i18n error catalogs.

**Examples**:
- `ERR_PAYMENT_DECLINED` — 402 — user-facing → "Card declined; try another"
- `ERR_TENANT_LIMIT_EXCEEDED` — 429 — user-facing → "Upgrade plan or wait"
- `ERR_INTERNAL_DB_TIMEOUT` — 503 — not user-facing → on-call escalation

---

## 2.9 User-Facing Events — `UX-NNN`

**Schema**: `UX-ID | trigger | channel (email/in-app/SMS/push) | template_location | recipient_role`

**Sources**: Email templates, notification configs, status-change handlers.

**Examples**:
- Welcome email on signup
- Payment receipt on charge success
- Subscription canceled confirmation
- Password reset link

---

## 2.10 External Dependencies — `DEP-NNN`

**Schema**: `DEP-ID | name | purpose | criticality (P0/P1/P2) | failure_impact | fallback_if_any | status_page_url | contact_path`

**Sources**: SDK imports, API client classes, infrastructure configs.

**Examples**: Stripe, SendGrid, AWS S3, Twilio, Auth0, Datadog.

---

## 2.11 Data Retention / Privacy — `PRV-NNN`

**Schema**: `PRV-ID | data_type | PII_class (none/basic/sensitive) | retention_policy | erasure_path | lawful_basis (GDPR)`

**Sources**: Schema definitions, retention configs, GDPR endpoints, privacy policy.

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

This linkage powers the Master Traceability Matrix in Phase 5.
