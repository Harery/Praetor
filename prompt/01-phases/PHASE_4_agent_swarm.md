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

## Agent Activation Matrix

| Category | Always | Conditional |
|---|---|---|
| CAT-A | A04, A05, A06, A07, A09 | A08 if FRONTEND_UI present |
| CAT-B | A10, A11 | — |
| CAT-C | A12, A13 | (A07 for SLO-linked alerts) |
| CAT-D | A14, A15 | — |
| CAT-E | A16, A17 | (A06 for technical evidence) |

## Per-Module Response Structure

```
# Module M_X — <Name>

## Module Context
- Path, layers, linked registers

## Coverage Ledger Check
(Orchestrator notes any artifacts marked DUPLICATE_OF_<id>)

## CATEGORY A — Engineering & QA [ENG]
### A.P0
| TC ID | Audience | Priority | Status | Agent | Layer | Component | Linked IDs | Description | Pre-conditions & Scope | Steps | Expected Result | Type |

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

## Citations Index — M_X
| Ref ID | file:line | Used in artifacts | Re-derived |

## Quality Council Notes
(QC_FAILED items and reasons)

--- END MODULE M_X (n of N) — reply 'continue' for next module ---
```

If approaching token budget, see `08-protocols/CHUNKING_PROTOCOL.md`.
