# Quality Gates

## Three Gates in the Pipeline

```
Gate 1 — Discovery Gate (Phase 3)
  Who reviews: Coordinator + audience leads
  Pass criteria: Discovery Report accepted (user replies `continue`)
  Fails to: rework Phase 1/2 with corrections

Gate 2 — Quality Council Review (Phase 5, per artifact)
  Who reviews: 3-judge panel (Coverage / Correctness / Clarity)
  Pass criteria: all 3 judges assent
  Fails to: agent rework once; then emit with QC_FAILED tag

Gate 3 — Wrap-Up Acceptance (Phase 6)
  Who reviews: leadership + all audience leads
  Pass criteria: Master Traceability Matrix accepted
  Fails to: re-run targeted modules or audiences
```

## Per-Artifact Quality Checks

| Audience | Coverage check | Correctness check | Clarity check |
|---|---|---|---|
| [ENG] | All branches covered | Citations real | Test executable as-written |
| [BIZ] | All BRs translated | Verification matches BR | BA can read without help |
| [OPS] | All failure modes have RB | Commands work | 3am-grade |
| [SUP] | All ERR translated | No dead ends | Tier-1 agent can execute |
| [COMP] | All controls mapped | Evidence cited | Audit-defensible |

## QC_FAILED Tag Format

```
STATUS: QC_FAILED
Failed judge: <1, 2, or 3>
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
