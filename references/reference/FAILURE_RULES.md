<!-- Praetor — Production Readiness Audit Skill
     Copyright (c) 2026 Mohamed Elharery (https://github.com/Harery). All rights reserved.
     Project repository: https://github.com/Harery/Praetor
     Licensed under the MIT License; see LICENSE at the repository root. -->

# Failure & Ambiguity Rules

When the kit encounters unclear, missing, or contradictory input, these rules
govern the model's behavior.

## 1. Source Resolution Failure (Phase 0)

| Condition | Action |
|---|---|
| No source provided at all | HALT with BLOCKER message |
| GitHub repo inaccessible | Switch to attached files; if none, HALT |
| Local path doesn't exist | HALT |
| Upload archive empty | HALT |

## 2. Discovery Failures (Phase 1)

| Condition | Action |
|---|---|
| Unlocatable import | Log as `UNKNOWN_DEP`, continue |
| Manifest present but framework unrecognizable | Mark as `UNKNOWN`, surface in Open Questions |
| Polyglot, no dominant language (no language ≥60%) | List each language's modules separately |
| > 2000 source files post-exclusion | Emit partial Discovery Report; request narrowed scope |
| > 20 modules decomposed | Warn at the gate: full-platform Phase 4 spans many sessions; recommend `RUN_MODULES` scoping or priority-banded runs (P0 first) |
| Test framework absent | Propose canonical default for the stack; flag for confirmation |

## 3. Domain Mapping Failures (Phase 2)

| Condition | Action |
|---|---|
| Business intent unclear, no docs | Mark register entry `INFERRED` with confidence note |
| Opaque external SDK | Generate contract test against documented interface; flag `ASSUMPTION` |
| Documented rule contradicts code behavior | Cite both; treat code as authoritative for `[ENG]`; surface conflict as `[BIZ]` failing validation |
| State machine implicit (no library, just `if/else`) | Reconstruct from code; mark `INFERRED`; ask for confirmation |
| No README, no /docs at all | Surface as a top-level Open Question; high INFERRED rate expected |

## 4. Generation Failures (Phase 4)

| Condition | Action |
|---|---|
| Function cannot be tested in isolation (opaque deps) | Generate contract test; document assumption |
| Module too large for one response | Invoke CHUNKING_PROTOCOL first; if still too large, split into sub-modules (Orchestrator coordinates) |
| Generated test depends on infra not present | Document infra requirement in Pre-conditions; flag |
| Category genuinely doesn't apply | Each activated agent emits `NO_WORK_FOUND` with reason (U1; Judge 4 reviews); never skip silently |

## 5. Never Do These Things

- **Never fabricate** file paths, function names, role names, error codes,
  customer-facing strings, SLAs, dependency names, or compliance controls.
- **Never invent** a business rule that isn't visible in code or docs.
- **Never claim** test evidence for a control without a real test case ID.
- **Never write** tests for code you have not actually read.
- **Never hide** ambiguity behind plausible-sounding output.

## 6. When to HALT

HALT (stop and ask the user) when:
- Phase 0 source resolution fails completely.
- A configuration override conflicts with itself (e.g., `RUN_CATEGORIES = []`).
- The repo exceeds the size limit and no scope override is provided.
- Critical ambiguity in registers would propagate into more than 50% of modules.

## 7. Confidence Notation

```
CONFIRMED   — explicit in code or docs
INFERRED    — derived from behavior; needs human confirmation
ASSUMPTION  — based on documented interface to opaque dependency
UNKNOWN     — could not determine; flagged for human input
```

Every register entry and every generated artifact may carry one of these tags.
The wrap-up matrix counts confidence levels per audience.

This is the *confidence* vocabulary; the *artifact status* vocabulary
(including `INFERRED`'s second role as a status) is defined in
`references/protocols/ARTIFACT_STATUS.md` — see its Counting rule for how
the two relate.
