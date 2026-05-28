# Phase 5 — Quality Council Review

**Owner**: Quality Council (3-judge panel: Coverage, Correctness, Clarity).

## How It Runs

Quality Council reviews inline with Phase 4 — before any artifact is emitted
in the module response. The flow:

1. Tier-2/3/4 agents produce artifacts
2. Quality Council reviews each artifact in parallel along three axes
3. Failures get a single rework chance (silent)
4. Final emission tags artifacts with READY or QC_FAILED

## Three Judges

| Judge | Persona | Question | Triggers QC_FAILED |
|---|---|---|---|
| 1 | Test coverage analyst, 12y | Coverage: did agent cover its scope? | Missing branches, untested paths |
| 2 | Senior code reviewer, 15y | Correctness: is everything accurate? | Bad citations, wrong logic |
| 3 | Technical writer, 10y | Clarity: will the audience understand? | Jargon for wrong audience |

Any single judge can flag. Passing requires all three to assent.

## QC_FAILED Output

QC_FAILED artifacts STILL appear in the module response — they are tagged,
not hidden. This is intentional: it shows the user what didn't pass review.

```
| TC-... | ... | STATUS: QC_FAILED | ... |
QC Note: Judge 3 (Clarity): "Step 4 mentions 'gRPC stub' undefined for [SUP] audience"
```

See `08-protocols/QUALITY_GATES.md` and `07-agents/AGENT_quality_council.md`.
