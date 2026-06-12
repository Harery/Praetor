<!-- Praetor — Production Readiness Audit Skill
     Copyright (c) 2026 Mohamed Elharery (https://github.com/Harery). All rights reserved.
     Project repository: https://github.com/Harery/Praetor
     Licensed under the MIT License; see LICENSE at the repository root. -->

# Phase 3 — Discovery Report + Confirmation Gate

**Owner**: Orchestrator (consolidates output from A01, A02, A03).

## v2 Discovery Report Structure

NEW LEADING SECTIONS (solve v1 Gaps #2 and #3):
1. **Audit Trail** (from A01) — full file-by-file inventory visible
2. **Tooling Profile** (from A03) — detected stack and format adaptations
3. **⚠️ MUST CONFIRM** — prominently displayed INFERRED items with material impact
4. **Priority Distribution Report** (from A02) — banded check with rebalance notes

5. Source, Stack & Layers, Test Tooling, Structure, Module Inventory
6. Register Summary
7. Audience Deliverables Plan
8. Run Configuration
9. ID Schemes
10. Open Questions

GATE:
```
GATE: Reply per CONDITIONAL_CONTINUE protocol.
Accepted replies:
  • continue                                — accept all defaults
  • continue with: Q1=..., Q2=unknown, ...  — answer some inferred items
  • correct: ... then continue              — fix discovery before proceed
  • override: RUN_X = [...] then continue   — narrow scope
  • halt                                    — stop and wait
  • <any question>                          — answered in place; gate re-shown,
                                              no snapshot, no state loss
```

Reply blocks may be combined in one message (e.g., `continue with:` answers
plus an `override:` scope) — every block present is applied, per
CONDITIONAL_CONTINUE Format 5.

See `references/protocols/CONDITIONAL_CONTINUE.md` (including its parsing
order — questions first, then keyword blocks, halt as default).
