# Phase 6 — Cross-Audience Wrap-Up

**Owner**: Orchestrator (consolidates from all agents' Phase 4 output).

## v2 Wrap-Up Sections

1. Coverage Summary by Audience
2. Master Traceability Matrix (Register → audience coverage GREEN/YELLOW/RED).
   When a matrix row shows INFERRED, label which axis applies:
   `INFERRED (confidence)` for register entries, `INFERRED (status)` for
   artifacts — the same word covers two vocabularies (see
   `08-protocols\/ARTIFACT_STATUS.md` Counting rule).
3. Priority-Banded Gap Report
4. Under-Resourced-Team Action Plans (top 10 highest-leverage per BIZ/OPS/SUP)
5. Cross-Functional Risk Findings
6. Onboarding Quick-Starts (one-page each for BIZ/OPS/SUP)
7. CI / Process Integration

NEW in v2:
8. **Coverage Ledger Summary** — what was actually emitted; duplicates
   referenced. Includes an **Agents Not Activated** line: any conditional agent
   (A08 without a frontend layer, A09 on a narrow non-critical run) whose spawn
   condition was false this run, with the reason — so non-activation is visible,
   not silent.
9. **STATUS Distribution** — counts per status across all artifacts, AND
    **Root Cause Aggregation** (per `08-protocols\/ROOT_CAUSE_GROUPING.md`):
    report distinct-bug count alongside test count, e.g. "14 READY_EXPOSES_BUG
    tests → 10 distinct root causes (RC-…)". Distinct bugs, not test rows, are
    the number leadership acts on.
10. **QC Flag Summary** — items the Quality Council flagged
11. **Priority Distribution Final Report** — A02's final P0/P1/P2 percentages
12. **Tooling Adoption Recommendations** — from A03 where tools were missing
13. **Risk Register Master View** — A17's consolidated risk register
14. **Regression Prevention Plan** — for each CRITICAL/HIGH risk fixed, a
    plan to prevent regression:
    - Which test goes into CI (cite TC-ID)
    - Which alert needs to fire on regression (cite AL-ID)
    - Which runbook handles re-occurrence (cite RB-ID)
    - Recommended CI gates (e.g., "axe-core fails on any new WCAG violation")
    
    Format example:
    ```
    Regression Prevention for RR-M_ORDERS-001 (IDOR):
      CI gate: TC-M_ORDERS-SEC-IDOR-001 must pass on every PR
      Alert: AL-M_ORDERS-IDOR_DETECTION-001 fires if exploit pattern detected
      Runbook: RB-M_ORDERS-IDOR_INCIDENT-001
      Recommended: add a pre-commit hook running the security test subset
    ```

15. **Fixture Report** (per `08-protocols\/TEST_FIXTURES.md`): fixture
    references across tests, distinct fixtures emitted (the actual setup work
    the team must build — fixtures are deduplicated at emit, so this count is
    already unique), and fixtures shared by two or more tests

## Gate 3 — Wrap-Up Acceptance

This wrap-up is Gate 3 of the pipeline (per
`08-protocols\/QUALITY_GATES.md`): the user (in team settings,
leadership + audience leads) reviews the Master Traceability Matrix; failure
routes to targeted module or audience re-runs.

### Cadence recommendation (advisory — not a wrap-up section)
- Full re-run: quarterly
- Phase 0–3 only (register refresh): monthly
- Per-module re-run: after major change

The cadence governs when to *initiate* runs. Once any run reaches its final
module, Phase 6 emits — every run, mandatory per U6, regardless of cadence.
