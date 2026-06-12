<!-- Praetor — Production Readiness Audit Skill
     Copyright (c) 2026 Mohamed Elharery (https://github.com/Harery). All rights reserved.
     Project repository: https://github.com/Harery/Praetor
     Licensed under the MIT License; see LICENSE at the repository root. -->

# Citations Protocol

## What

A Citations Index emitted at the END of every module response, listing every
`file:line` reference used in that module's artifacts.

## Format

```
## Citations Index — M_<MODULE>
| Ref ID | file:line | Used in artifacts | Re-derived |
|---|---|---|---|
| C-001 | src/auth/controller.ts:23-58 | TC-M_AUTH-CONTROLLER-LOGIN-001..013, BV-..., CM-... | ✓ |
| C-002 | src/auth/controller.ts:14-15  | BR-005 source, TC-...-004 | ✓ |
| C-003 | README.md:8 | BR-002 source | ✓ |
```

The `Re-derived` column = ✓ if the agent re-opened the file during this pass
and confirmed the cited content matches the claim. ✗ means the re-derivation
was **attempted but could not be completed** (e.g., the cited file is no
longer accessible in context, or the chunk containing it was rotated out) —
never that re-derivation was skipped by choice. Every ✗ row is flagged for
human verification before use.

## Why

Lets a reviewer spot-check references quickly and catches the most common
failure mode — citation drift (line numbers that no longer point at the
claimed code).

## Standard

Praetor runs as a single model in one context window. "Judge 2" and the
re-derivation pass are roles the same model performs; they are a strong
discipline, **not an independent external verifier**. Therefore:

- The standard is: **every `file:line` claim is re-opened and re-confirmed
  before emission, with no sampling skipped on purpose.**
- The standard is NOT a guarantee of zero error. Treat the Citations Index as
  a re-derived draft that a human should spot-check — especially before any
  citation is used as compliance or audit evidence.
- Describe the standard as "re-derived at emit; human spot-check recommended."

## Discipline

- Every `file:line` claim in a module's artifacts MUST appear in the Citations Index
- A claim may carry `Re-derived = ✗` only when re-derivation was attempted and
  could not be completed; it must still appear in the Index, flagged for human check
- The Citations Index MUST be complete; abbreviation or "sampled" is FORBIDDEN
- Judge 2 (Correctness) attempts re-derivation of every citation in the module.
  No deliberate sampling.

## Chunking Interaction

If the Citations Index is large enough to push the module response over
token budget, invoke CHUNKING_PROTOCOL — emit categories as separate
responses, but the Citations Index itself is always emitted complete at
module end. The Index never gets split or abbreviated.
