# Artifact Status Protocol

## The 7 Status Values

```
READY                       — Default. Artifact can be executed/adopted/filed as-is.
READY_EXPOSES_BUG           — Test is correct and executable; current code will fail it.

INFERRED                    — Depends on an INFERRED register entry; reliability conditional.
BLOCKED_BY_MISSING_CODE     — References code that doesn't exist; cannot execute yet.
DUPLICATE_OF_<id>           — Already covered at same layer; reference only.
RELATED_TO_<id>             — Same scenario at different architectural layer; both kept.

DEFERRED_TO_<phase|module>  — Intentionally out of scope for this run.
```

## Extended Status Values (per category)

Categories add specialized statuses:

```
[ENG]   UNTESTABLE_AS_WRITTEN    — code structure prevents isolated testing; refactor first
[OPS]   BLOCKED_NEEDS_INSTRUMENTATION  — failure mode unobservable
[SUP]   BLOCKED_NO_RESOLUTION    — no resolution path defined; needs engineering RB
[BIZ]   BLOCKED_NO_UI_PATH       — BR exists only at code level
[COMP]  AUDIT_GAP                — control required but evidence missing
        OUT_OF_SCOPE             — framework not declared in scope
        MANUAL_CONTROL           — implemented via process, not code
```

Quality Council also tags:
```
QC_FAILED                   — Did not pass Quality Council review; reason cited
```

## Usage Rule

Every artifact has exactly ONE status. If multiple apply, the most severe
wins (BLOCKED > INFERRED > READY_EXPOSES_BUG > READY).

`READY_EXPOSES_BUG` is the correct tag when a test is well-formed and ready
to execute, but the code under test will fail it. This is **not a defect of
the test** — it's how the test signals the code defect. The associated risk
register entry (from A06/A09/A17) carries the severity; the test itself is
just doing its job.

## Wrap-Up Reporting

Phase 6 wrap-up reports status distribution per category, e.g.:
```
[ENG] M_AUTH: 13 READY, 2 BLOCKED_BY_MISSING_CODE, 0 INFERRED, 0 DUPLICATE
```
