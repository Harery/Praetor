<!-- Praetor — Production Readiness Audit Skill
     Copyright (c) 2026 Mohamed Elharery (https://github.com/Harery). All rights reserved.
     Project repository: https://github.com/Harery/Praetor
     Licensed under the MIT License; see LICENSE at the repository root. -->

# Quality Gates

## Three Gates in the Pipeline

```
Gate 1 — Discovery Gate (Phase 3)
  Who reviews: the user (in team settings: the human Coordinator + audience
               leads per references/execution/TEAM_ASSIGNMENTS.md)
  Pass criteria: Discovery Report accepted (user replies `continue`)
  Fails to: rework Phase 1/2 with corrections

Gate 2 — Quality Council Review (Phase 5, per artifact)
  Who reviews: 4-judge panel (Coverage / Correctness / Clarity / Skip-Validity)
  Pass criteria: all APPLICABLE judges assent.
                 Judges 1–3 are always applicable.
                 Judge 4 (Skip-Validity) is applicable only when the artifact
                 carries STATUS: NO_WORK_FOUND.
  Fails to: agent rework once; then emit with QC_FAILED tag

Gate 3 — Wrap-Up Acceptance (Phase 6)
  Who reviews: the user (in team settings: leadership + all audience leads)
  Pass criteria: Master Traceability Matrix accepted
  Fails to: re-run targeted modules or audiences
```

## Per-Artifact Quality Checks

| Audience | Coverage check | Correctness check | Clarity check |
|---|---|---|---|
| [ENG] | All branches covered | Citations re-derived & accurate | Test executable as-written |
| [BIZ] | All BRs translated | Verification matches BR | BA can read without help |
| [OPS] | All failure modes have RB | Commands work | 3am-grade |
| [SUP] | All ERR translated | No dead ends | Tier-1 agent can execute |
| [COMP] | All controls mapped | Evidence cited | Audit-defensible |

> Skip-Validity (Judge 4) is not an audience-specific check — it applies to any
> artifact, in any audience, that is emitted as `NO_WORK_FOUND`. It verifies the
> skip against the module's risk register before the skip is allowed to pass.

## QC_FAILED Tag Format

Two forms, same fields, chosen by context:

- **Standalone block** (below) — used when a QC failure is emitted as its own
  item (e.g., in the Quality Council Notes section).
- **Inline one-liner** — used inside artifact tables and module responses,
  compressed to `QC Note: Judge <n> (<axis>): "<reason>"` per
  `references/phases/PHASE_5_quality_council.md` and the Quality Council
  charter Rule 3. The judge and reason are identical in both forms.

```
STATUS: QC_FAILED
Failed judge: <1, 2, 3, or 4>
Reason: <one-line specific failure>
Recommendation: <what to do>
```

Example:
```
STATUS: QC_FAILED
Failed judge: 3 (Clarity)
Reason: Step 4 uses "gRPC stub" — undefined for [SUP] audience.
Recommendation: Rewrite as "internal API call (engineering can clarify)".
```

Skip-Validity example:
```
STATUS: QC_FAILED
Failed judge: 4 (Skip-Validity)
Reason: SKIP_UNDEFENDED — agent emitted NO_WORK_FOUND for [SUP], but ERR-014
        (402 card declined) in this module is user-facing and ticket-driving.
Recommendation: Produce a triage entry for ERR-014.
```
