# Citations Protocol

## What

A Citations Index emitted at the END of every module response, listing every
`file:line` reference used in that module's artifacts.

## Format

```
## Citations Index — M_<MODULE>
| Ref ID | file:line | Used in | Verified |
|---|---|---|---|
| C-001 | src/auth/controller.ts:23-58 | TC-M_AUTH-CONTROLLER-LOGIN-001..013, BV-..., CM-... | ✓ |
| C-002 | src/auth/controller.ts:14-15  | BR-005 source, TC-...-004 | ✓ |
| C-003 | README.md:8 | BR-002 source | ✓ |
```

The `Verified` column = ✓ if the agent actually opened the file and confirmed
the cited content matches. ✗ if it was extracted from another artifact
without re-verification.

## Why

Lets a reviewer spot-check ~10 random references quickly. Catches fabrication
or misremembered line numbers.

## Discipline

- Every `file:line` claim in a module's artifacts MUST appear in the Citations Index
- A claim can be `Verified = ✗` (cited from earlier source) but must still appear
- The Citations Index MUST be complete; abbreviation or "sampled" is FORBIDDEN
- The Quality Council Judge 2 (Correctness) verifies **100%** of citations
  per module. No sampling.

## Chunking Interaction

If the Citations Index is large enough to push the module response over
token budget, invoke CHUNKING_PROTOCOL — emit categories as separate
responses, but the Citations Index itself is always emitted complete at
module end. The Index never gets split or abbreviated.
