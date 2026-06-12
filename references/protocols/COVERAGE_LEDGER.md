<!-- Praetor — Production Readiness Audit Skill
     Copyright (c) 2026 Mohamed Elharery (https://github.com/Harery). All rights reserved.
     Project repository: https://github.com/Harery/Praetor
     Licensed under the MIT License; see LICENSE at the repository root. -->

# Coverage Ledger Protocol

## Purpose

Maintain a running list of every artifact emitted across modules, so when
an agent in module N+1 would re-cover something already covered in module
N, it can emit `DUPLICATE_OF_<id>` or `RELATED_TO_<id>` instead of
regenerating.

## Structure

The Orchestrator maintains the ledger:

```
| Artifact ID | Module | Agent | Layer | Component | Scope | Linked Register IDs | Status |
|---|---|---|---|---|---|---|---|
| TC-M_AUTH-MIDDLEWARE-AUTH-009 | M_AUTH | A06 | MIDDLEWARE | jwt-verify | tampered JWT rejected | INV-002 | READY |
```

The **Layer** column is mandatory.

**Status column vocabulary:** rows for `RR-` entries carry risk-lifecycle
values (OPEN / MITIGATING / MITIGATED / ACCEPTED / CLOSED); every other row
carries an artifact status. The two vocabularies are defined in
`references/protocols/ARTIFACT_STATUS.md` and never mix on one row.

## DUPLICATE_OF vs RELATED_TO

For an artifact in module N+1 to claim `DUPLICATE_OF_<id>`, ALL FOUR must
match the referenced artifact:
1. **Linked Register IDs** — same business rule / invariant / control
2. **Scope description** — same scenario
3. **Component** — same function/class/route/component
4. **Layer** — same architectural tier, using the canonical layer tags from `references/reference/ID_SCHEMES.md` (e.g., CONTROLLER / SERVICE / MIDDLEWARE / FRONTEND_UI / REPOSITORY / SCHEDULER)

If 1-3 match but Layer differs → emit `RELATED_TO_<id>`.

`RELATED_TO_<id>` means: "This scenario is also tested in `<id>`, but at a
different architectural layer; both tests are needed because failures at
each layer have distinct customer impact."

### Example

Backend (CONTROLLER layer) test for tenant isolation in `cancelOrder` —
note the ID's third slot carries the Discipline Tag `SEC` while the Layer
column carries the canonical Layer Tag `CONTROLLER` (two distinct
vocabularies, per `references/reference/ID_SCHEMES.md`; dedup matches on the
Layer column, never the ID slot):
```
| TC-M_ORDERS-SEC-IDOR-001 | M_ORDERS | A06 | CONTROLLER | cancelOrder | tenant isolation | INV-001 | READY_EXPOSES_BUG |
```

Frontend (FRONTEND_UI layer) test for the same scenario surfaces UI behavior
the backend test can't:
```
| TC-M_FRONTEND-INT-TENANT-001 | M_FRONTEND | A05 | FRONTEND_UI | OrderDetail | tenant isolation | INV-001 | RELATED_TO_TC-M_ORDERS-SEC-IDOR-001 |
```

Both are kept because backend rejecting and UI rendering the rejection are
distinct concerns. A backend that returns 404 but a UI that silently swallows
it is still a customer-facing bug.

## Usage Rule

Before any agent emits a new artifact, the Orchestrator checks the ledger:

```
Match scope on (Linked Register IDs, Scope description, Component):
  → No match: emit fresh artifact
  → Match + same Layer: emit DUPLICATE_OF_<id>
  → Match + different Layer: emit RELATED_TO_<id>
```

Scope/Component matching is **semantic, not string-literal**: the Orchestrator
normalizes both descriptions to (action + target + register ID) before
comparing — "tampered JWT rejected" and "reject token with flipped payload
byte" against the same INV and component are the same scenario.

**QC_FAILED artifacts are not eligible as `DUPLICATE_OF` targets.** An
artifact that failed Quality Council review cannot suppress a fresh attempt at
the same scenario in a later module; the fresh artifact is emitted and the
ledger keeps both rows.

## Granularity Guidance

- Two tests against same endpoint at the same layer for same BR: one wins (DUPLICATE)
- Two tests against same endpoint at different layers: both stay (RELATED)
- Two tests against same BR via different endpoints: both stay (no relation — distinct components)

## Mandatory Display Per Module

At the top of every module's response — before any category section,
immediately after `## Module Context` per the canonical structure in
`references/phases/PHASE_4_agent_swarm.md` — the Orchestrator emits:

```
## Coverage Ledger Check
Modules covered so far: <list>
Shared scenarios pre-instructed: <list with planned DUPLICATE_OF / RELATED_TO refs>
```

This makes deduplication decisions visible before agents emit.

## Phase 6 Wrap-Up

Phase 6 includes:
- Total artifacts emitted: N
- Duplicates referenced (DUPLICATE_OF): M
- Related references (RELATED_TO): K
- Net unique scenarios: N − M (RELATED_TO counts as unique because layer differs)
