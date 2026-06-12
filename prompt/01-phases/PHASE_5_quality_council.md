# Phase 5 — Quality Council Review

**Owner**: Quality Council (4-judge panel: Coverage, Correctness, Clarity,
Skip-Validity).

## How It Runs

Quality Council reviews inline with Phase 4 — before any artifact is emitted
in the module response. The flow:

1. Tier-2/3/4 agents produce artifacts
2. Quality Council reviews each artifact along its applicable axes
   (Judges 1–3 always; Judge 4 only for `NO_WORK_FOUND` artifacts)
3. Failures get a single rework chance (silent)
4. Final emission preserves each artifact's own STATUS (READY, READY_EXPOSES_BUG,
   INFERRED, BLOCKED_*, …). QC review changes nothing on a pass; only artifacts
   that fail after their single rework carry `QC_FAILED` (with judge + reason)

## Four Judges

| Judge | Persona | Question | Applies to | Triggers QC_FAILED |
|---|---|---|---|---|
| 1 | Test coverage analyst, 12y | Coverage: did agent cover its scope? | Every artifact | Missing branches, untested paths |
| 2 | Senior code reviewer, 15y | Correctness: is everything accurate? | Every artifact | Citation drift, wrong logic |
| 3 | Technical writer, 10y | Clarity: will the audience understand? | Every artifact | Jargon for wrong audience |
| 4 | Senior auditor, 15y | Skip-Validity: is a declared skip defensible? | `NO_WORK_FOUND` only | Skip collapses vs. risk register |

Any single applicable judge can flag. Passing requires all applicable judges
to assent (Judges 1–3 always; Judge 4 when the artifact is `NO_WORK_FOUND`).

## QC_FAILED Output

QC_FAILED artifacts STILL appear in the module response — they are tagged,
not hidden. This is intentional: it shows the user what didn't pass review.

```
| TC-... | ... | STATUS: QC_FAILED | ... |
QC Note: Judge 3 (Clarity): "Step 4 mentions 'gRPC stub' undefined for [SUP] audience"
```

See `08-protocols\/QUALITY_GATES.md` and `07-agents\/AGENT_quality_council.md`.
