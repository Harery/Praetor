<!-- Praetor — Production Readiness Audit Skill
     Copyright (c) 2026 Mohamed Elharery (https://github.com/Harery). All rights reserved.
     Project repository: https://github.com/Harery/Praetor
     Licensed under the MIT License; see LICENSE at the repository root. -->

# Priority Rubric — How to Classify P0 / P1 / P2

Every register entry (BR, WF, SM, etc.) and every generated artifact carries a
priority tag. This file defines exactly what each tier means and gives concrete
examples per audience so classification is consistent across the kit.

## Definitions

### P0 — Critical
An item is P0 if **any one** of these is true:
- It directly touches revenue (billing, payments, subscription state, pricing).
- It affects security or authentication (login, session, secrets, authz).
- It involves customer data integrity (loss, corruption, unauthorized disclosure).
- It's a regulatory or compliance control with audit consequences.
- It blocks any user from completing a core, advertised task.
- Its failure would trigger a Sev1/Sev2 incident.

### P1 — High
An item is P1 if **any one** of these is true:
- It supports a common user journey (used by >10% of active users).
- It's a frequent driver of support contacts (top 20 ticket categories).
- It's a common operational failure mode (alerts more than weekly).
- It degrades user experience materially when broken, but doesn't block core tasks.
- It's required for a documented but non-critical SLA.

### P2 — Standard
Everything else: edge functionality, low-volume scenarios, completeness items,
polish, internal tools, dev affordances, optional features.

---

## Examples Per Audience

### Engineering `[ENG]`

| Priority | Example |
|---|---|
| P0 | Test that JWT signature is verified on every protected route |
| P0 | Test that `order.total = sum(line_items)` invariant holds after partial refund |
| P0 | Test that a deleted user's PII is purged within 30 days (GDPR) |
| P0 | Test that SQL queries use parameterized inputs (injection prevention) |
| P1 | Test that pagination returns stable order under concurrent inserts |
| P1 | Test that `useEffect` cleanup cancels in-flight fetch on unmount |
| P1 | Test that retry logic backs off exponentially with jitter |
| P2 | Test that German locale renders currency as `1.234,56 €` |
| P2 | Test that property-based fuzzer doesn't crash the input validator |

### Business `[BIZ]`

| Priority | Example |
|---|---|
| P0 | UAT: "Free-tier user cannot exceed 100 API calls/day" (revenue protection) |
| P0 | UAT: "Customer can complete checkout with saved payment method" (core flow) |
| P0 | Risk: "Pricing calculation depends on undocumented coupon stacking rule" |
| P1 | UAT: "Admin can export user list as CSV" (common journey) |
| P1 | Journey map: "Trial signup → onboarding → first value moment" |
| P2 | UAT: "Tooltip appears when hovering the help icon in settings" |

### Operations `[OPS]`

| Priority | Example |
|---|---|
| P0 | Runbook: "Payment provider returns 5xx — switch to backup processor" |
| P0 | Alert: "DB connection pool >90% saturated for 5 min" → page on-call |
| P0 | SLO: API p99 latency < 500ms (revenue-correlated) |
| P0 | DR: RPO 1 hour, RTO 4 hours for production DB |
| P1 | Runbook: "Background job queue depth growing — scale workers" |
| P1 | Dashboard: per-tenant request rate (capacity planning) |
| P2 | Runbook: "Log shipping degraded but functional" |

### Support `[SUP]`

| Priority | Example |
|---|---|
| P0 | Triage: "Customer can't log in" → password reset flow → escalate after 2 attempts |
| P0 | Error translation: `ERR_PAYMENT_DECLINED` → "Your card was declined. Try a different payment method." |
| P0 | Comm template: "Service degradation — investigating" |
| P0 | Escalation: any data loss claim → immediate Sev1 + engineering page |
| P1 | FAQ: "How do I change my plan?" with vetted answer |
| P1 | Cheat sheet: subscription states (active / past_due / canceled / paused) |
| P2 | Comm template: "Scheduled maintenance window reminder" |

### Compliance `[COMP]`

| Priority | Example |
|---|---|
| P0 | Control mapping: SOC2 CC6.1 (logical access controls) → `auth/middleware.ts:42` |
| P0 | PII map: email + name + DOB stored in `users` table, encrypted at rest |
| P0 | Risk register: "Customer data exported via admin endpoint with insufficient audit logging" |
| P1 | Audit evidence: quarterly access review process documentation |
| P2 | Compliance: ISO 27001 nice-to-have alignment |

---

## Classification Decision Tree

```
Is failure likely to cause...
├── Material revenue loss?          → P0   (default materiality: >1% of MRR
│                                           per day; if the org has its own
│                                           threshold, A02 surfaces it as an
│                                           Open Question at the gate)
├── Customer data exposure?         → P0
├── Compliance violation?           → P0
├── Sev1/Sev2 incident?             → P0
├── Auth/security weakness?         → P0
└── Block on a core advertised task? → P0

Otherwise, is it...
├── Used by >10% of users?          → P1
├── Top-20 support ticket driver?   → P1
├── Common ops failure mode?        → P1
└── Affects documented SLA?         → P1

Otherwise:                          → P2
```

---

## Module Criticality vs Artifact Priority (they are different axes)

A01 assigns a **module** criticality (P0/P1/P2); A02 and the test agents assign
each **artifact** its own priority. These do not have to match, and one does
not override the other:

- A P0 module (e.g., the login frontend, P0 by L-02 layer inheritance) still
  contains individual P1/P2 artifacts — a `useEffect` cleanup test in that
  module is P1, a locale-formatting test is P2. The module being P0 means it is
  *in scope first and reviewed hardest*, not that every test in it is P0.
- Conversely a P2 module can still hold one P0 artifact (e.g., a security test).

Rule: module criticality drives **scheduling and scope order**; artifact
priority drives **which artifacts must pass before release**. When you cite a
priority, be explicit which axis you mean. The frontend login module is P0 (it
serves a P0 flow) even though most of its individual UI tests are P1/P2.

## Avoiding Priority Inflation

The most common mistake is calling everything P0. Use this discipline:

- If P0 covers more than **30%** of items in a register, you're inflating.
  Re-classify the marginal P0s to P1.
- If P2 covers fewer than **30%** of items, you're either missing P2-level
  items or over-classifying minor things as P1.
- Healthy distribution: the v2 target bands — **15–30% P0 / 30–50% P1 /
  30–50% P2** (enforced by A02; see the v2 ADDITION below).

A02 targets this distribution in Phase 2 and flags deviations in Phase 3.

---

# v2 ADDITION — Automatic Priority Distribution Enforcement

## The Target Bands

| Priority | Healthy band | Skewed if outside by |
|---|---|---|
| P0 | 15–30% | >10 points |
| P1 | 30–50% | >10 points |
| P2 | 30–50% | >10 points |

## Enforcement (executed by Agent A02)

After populating each register, A02 calculates the distribution. If any band
is skewed:

1. **Iteration 1**: Re-classify the lowest-justified entries in the bloated
   band. Document each move with a note in the rebalance log.
2. **Iteration 2**: If still skewed, re-classify again with stricter criteria.
3. **Halt at iteration 2**: If still skewed after 2 iterations, A02 emits:
   ```
   UNCORRECTABLE_DISTRIBUTION
   Reason: <e.g., "Platform is genuinely P0-heavy due to financial controls;
   58% of BRs touch money movement.">
   ```
   Then proceeds. The user sees the deviation in Phase 3.

## Emitted Output

```
## Priority Distribution Report (Agent A02)

Register: BR-NNN
  Total entries: 47
  P0: 12 (25.5%) ✓ in band
  P1: 21 (44.7%) ✓ in band
  P2: 14 (29.8%) ⚠ slightly low, acceptable

Register: COMP-NNN
  Total entries: 19
  P0: 14 (73.7%) ✗ skewed
  Rebalance applied: 5 entries moved P0→P1 (audit-evidence rather than control-implementation)
  After rebalance:
  P0: 9 (47.4%) ✗ still skewed
  Rebalance iteration 2 applied: 3 more moved P0→P1
  P0: 6 (31.6%) ⚠ marginal, accepting

Register: ERR-NNN
  Total entries: 23
  P0: 18 (78.3%) ✗ skewed
  UNCORRECTABLE_DISTRIBUTION
  Reason: Error catalog dominated by user-facing payment errors,
  all of which are revenue-critical by definition. Accepting skew.
```

## Why This Matters

Without enforcement, ratings creep. Without the visible report, no one notices.
