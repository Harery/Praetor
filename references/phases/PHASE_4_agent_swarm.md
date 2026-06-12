<!-- Praetor — Production Readiness Audit Skill
     Copyright (c) 2026 Mohamed Elharery (https://github.com/Harery). All rights reserved.
     Project repository: https://github.com/Harery/Praetor
     Licensed under the MIT License; see LICENSE at the repository root. -->

# Phase 4 — Agent Swarm (per module)

**Owner**: Orchestrator dispatches Tier-2/3/4 agents per module.

## How the Swarm Works

For each module M_X:
1. Orchestrator reads Module Inventory (from A01)
2. Orchestrator determines which agents apply based on:
   - Layers present (e.g., A08 only if FRONTEND_UI)
   - RUN_CATEGORIES override (e.g., A12+A13 if CAT-C in scope)
   - RUN_PRIORITIES override (e.g., A09 only if P2 in scope or critical-path module)
3. Orchestrator dispatches relevant agents together (sequentially simulated)
4. Each agent emits artifacts with full STATUS tagging
5. Quality Council reviews (Phase 5, inline per module)
6. Orchestrator consolidates and emits

## Agent Activation

**Activation is decided by the single source of truth:** the Agent Activation
Matrix in `references/agents/AGENT_ROSTER.md` (including its conditional
footnotes for A08, A09, and the A06/A07 evidence-feeder roles). No copy of
the matrix is maintained here — read the roster before dispatching.

## Per-Module Response Structure

```
# Module M_X — <Name>

## Module Context
- Path, layers, linked registers

## Coverage Ledger Check
(Orchestrator emits the block defined in `references/protocols/COVERAGE_LEDGER.md`:
modules covered so far + scenarios pre-instructed as DUPLICATE_OF_<id> or RELATED_TO_<id>)

## CATEGORY A — Engineering & QA [ENG]
### A.P0
| TC ID | Audience | Priority | Status | Agent | Layer | Component | Linked IDs | Description | Pre-conditions & Scope | Steps | Expected Result | Type |
(add an optional `Root Cause` column when any artifact in the table carries an RC-ID — see ROOT_CAUSE_GROUPING)

### A.P1
### A.P2

## CATEGORY B — Business [BIZ]
...

## CATEGORY C — Operations [OPS]
...

## CATEGORY D — Support [SUP]
...

## CATEGORY E — Compliance [COMP]
...

## Fixtures — M_X
(Per `references/protocols/TEST_FIXTURES.md`: every test with a data
pre-condition emits its `FX-` seed fixture here, deduplicated via the
Coverage Ledger. Omit the section only if no test in the module needs data state.)

## Citations Index — M_X
| Ref ID | file:line | Used in artifacts | Re-derived |

## Quality Council Notes
(QC_FAILED items and reasons)

--- END MODULE M_X (n of N) — reply 'continue' for next module ---
```

If approaching token budget, see `references/protocols/CHUNKING_PROTOCOL.md`.
