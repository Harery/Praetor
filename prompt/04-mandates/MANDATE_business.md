# Mandate — Business / Product Audience `[BIZ]`

## Mandate Statement

Business owns **the semantics of every rule, workflow, and customer-facing
behavior**. They are the authoritative source when generated artifacts say
`INFERRED`. They do not need to read code.

## Scope of Authority

- All `[BIZ]` artifacts produced in Category B.
- Final ruling on business rule correctness (BR-NNN entries).
- Approval of UAT scripts and success criteria.
- Pricing, quota, and plan-related verifications.

## Hard Responsibilities

1. Validate the Business Rules, Workflows, and Roles registers at the Phase 3 gate.
2. Confirm or correct every `INFERRED` register entry within 5 business days
   of the gate.
3. Execute UAT scripts in staging or production (where safe) and sign off.
4. Maintain the Business Risk Register (B.5) as living document.
5. Run the Change-Impact Checklist (B.6) before any module-affecting release.

## Boundaries (Out of Scope)

- Business is **not** expected to read code, debug, or write tests.
- Business does **not** own runbooks, alerts, or support playbooks — those
  belong to OPS and SUP respectively.
- Business does **not** decide test framework or CI structure.

## Inputs Expected

- Product specs, contracts, pricing sheets, plan definitions.
- Access to staging environment for UAT execution.
- Read access to the help-desk knowledge base (to align with SUP artifacts).

## Outputs Expected

- Signed-off UAT pass per workflow per release.
- Updated BR register reflecting decisions on INFERRED entries.
- Quarterly business risk register review.

## Definition of Done

- Every P0 BR has a corresponding BV (business validation) entry signed off.
- Every P0 WF has a UAT script executed in the last release cycle.
- The Master Traceability Matrix shows GREEN for the `[BIZ]` column on all
  P0 register entries.

## Plain-Language Promise

The kit guarantees `[BIZ]` artifacts are readable without code knowledge. If
any artifact requires you to read code, file a quality issue against the kit.

## Escalation Paths

| Issue | Escalate to |
|---|---|
| Generated business rule contradicts product intent | Product Lead → Coordinator → re-run Phase 2 |
| UAT script fails | Engineering for diagnosis |
| Pricing/quota verification fails | Engineering + Compliance (revenue impact) |
| Customer-facing copy in template feels off | Support Lead for joint revision |

## Time Reality

- BR register validation: ~1 hour per 20 BRs.
- UAT script execution: ~30 min per script.
- Risk register quarterly review: ~4 hours.
- Annual time budget per BA: ~80 hours if 1 release/month, ~160 hours if biweekly.

## Anti-Patterns

- Signing off UAT without executing.
- Treating INFERRED rules as correct without confirmation.
- Ignoring the Change-Impact Checklist between releases.
