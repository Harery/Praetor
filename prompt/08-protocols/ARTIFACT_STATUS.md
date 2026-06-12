# Artifact Status — Single Source of Truth

This file is the **canonical registry** of every STATUS value an artifact may
carry. Any other file that lists or counts status values must defer to this
one. U4 (Status Tag Discipline) forbids ad-hoc tags — that rule is only
coherent if every tag an agent legitimately uses appears HERE.

## Core statuses (7)

| Status | Meaning |
|---|---|
| `READY` | Ready to execute / adopt / file. Default. |
| `READY_EXPOSES_BUG` | Test is correct; current code will fail it. |
| `INFERRED` | Based on inference; needs human confirmation. |
| `BLOCKED_BY_MISSING_CODE` | Cannot execute until referenced code exists. |
| `DUPLICATE_OF_<id>` | Already covered at same layer; reference only. |
| `RELATED_TO_<id>` | Same scenario at a different layer; both kept. |
| `DEFERRED_TO_<target>` | Intentionally postponed; out of scope. Target may be a phase, module, or named milestone/owner (e.g., `DEFERRED_TO_LAUNCH`, `DEFERRED_TO_GENERATOR`). |

## Extended statuses (category-specific)

These are NOT ad-hoc — they are part of the protocol and pass U4. They exist
because some audiences need a precise reason a piece of work could not be done.

| Status | Used by | Meaning |
|---|---|---|
| `NO_WORK_FOUND` | any | Scope analyzed; nothing applicable. Triggers Judge 4. |
| `UNTESTABLE_AS_WRITTEN` | [ENG] | Code can't be tested in isolation; needs refactor. |
| `BLOCKED_NEEDS_INSTRUMENTATION` | [ENG]/[OPS] | Needs observability that doesn't exist yet. |
| `BLOCKED_BY_TEST_DATA` | [BIZ] UAT, [ENG] A05 | Pre-setup state not achievable in staging / fixture not constructible. |
| `BLOCKED_NO_RESOLUTION` | [OPS] | Failure mode has no known remediation path. |
| `BLOCKED_NO_UI_PATH` | [SUP], [BIZ] A10 | No user-facing path exists to reproduce / verify in-product. |
| `AUDIT_GAP` | [COMP] | Control claimed but no implementation evidence. |
| `OUT_OF_SCOPE` | any | Outside the declared run configuration. |
| `MANUAL_CONTROL` | [COMP] | Control is satisfied by a manual process, not code. |
| `QC_FAILED` | QC | Failed a Quality Council judge; reason attached. |
| `UNCORRECTABLE_DISTRIBUTION` | A02 | Priority bands genuinely can't be balanced. |
| `COMPLIANCE_CLAIM_UNVERIFIED` | A02/A16 | Compliance marker present, code absent. |
| `BLOCKED_BY_MISSING_ENV` | [ENG] A07 | No performance-test environment available. |
| `INFERRED_BUDGET` | [ENG] A07 | No SLO defined; default perf budget applied; needs confirmation. |
| `MANUAL_VERIFICATION_REQUIRED` | [ENG] A08 | Needs a human screen-reader / assistive-tech walkthrough. |
| `BLOCKED_BY_MISSING_COMPONENT` | [ENG] A08 | References a UI component not in the repo. |
| `BLOCKED_BY_MISSING_SCHEMA` | [ENG] fixtures | Fixture references a table/column not in migrations yet. |
| `INFERRED_FAILURE_MODE` | [OPS] A12 | Failure mode hypothesized from code, not yet observed. |
| `BLOCKED_PENDING_RUNBOOK` | [OPS] A13 | Alert is sound but its linked runbook doesn't exist yet. |

## Modifier flags (not statuses)

These annotate an artifact *in addition to* its single STATUS; they never
replace it. U4 covers them because they are defined here:

| Flag | Used by | Meaning |
|---|---|---|
| `LONG_RUNNING_TEST` | A09 | Property-based corpus reduced; full run exceeds practical time. |
| `REQUIRES_TIER_2` | A14 | Triage step assumes tools/training beyond tier-1. |
| `OWNER_REQUIRED` | A17 | Risk entry has no identifiable owner; surfaced in wrap-up. |
| `SNAPSHOT_DRIFT` | A00 | Resumable snapshot commit ≠ live source; re-discovery offered. |
| `PRIORITY_REBALANCE_NOTE` | A02 | Documents P0/P1/P2 moves made during distribution enforcement. |
| `TOOL_AMBIGUITY_NOTE` | A03 | Two+ tools detected in one category with tied evidence; records the format-driver chosen (or that both formats were emitted) for human confirmation. |

## Skip vocabulary is closed

`NO_WORK_FOUND` is the **only** valid "nothing applicable" status. Agent- or
audience-flavored aliases (e.g., "NOT_APPLICABLE", "NO_TRIAGE_SURFACE_FOUND",
"SKIP") are forbidden: Quality Council Judge 4 triggers **only** on
`NO_WORK_FOUND`, so any alias would silently bypass Skip-Validity review.
Agents put the flavor in the rationale, not the tag
(e.g., `NO_WORK_FOUND — no customer-facing triage surface in this module`).

## Risk-lifecycle statuses (A17 only)

The Risk Agent (A17) tracks the lifecycle of a *risk*, not the readiness of an
*artifact*. Risk-register entries (`RR-`) carry one of these values; they are
a distinct vocabulary from the artifact statuses above, and U4's "only
protocol-defined tags" rule covers them because they are defined here:

| Status | Meaning |
|---|---|
| `OPEN` | Risk acknowledged; mitigation not started. |
| `MITIGATING` | Mitigation work in progress. |
| `MITIGATED` | Fix shipped; verify before closing. |
| `ACCEPTED` | Business decision to accept; needs executive sign-off. |
| `CLOSED` | Verified and closed. |

A risk-register entry (`RR-<MODULE>-<NNN>`) carries exactly one of these.
A generated artifact (TC/BV/RB/…) carries one of the core/extended statuses
above. The two vocabularies never mix on the same item.

## Counting rule

> **Related but separate vocabulary:** the confidence notation
> (`CONFIRMED` / `INFERRED` / `ASSUMPTION` / `UNKNOWN`) that annotates register
> entries and classifications is defined in
> `99-reference/FAILURE_RULES.md` §7. `INFERRED` appears in both
> vocabularies on purpose: as an artifact STATUS here, and as a confidence
> level there. U4 covers both because both are protocol-defined.

When any doc states a status count, it must say:
**"7 core statuses + extended set (see ARTIFACT_STATUS.md)"** rather than a
bare number that silently excludes the extended set.

The CHEATSHEET may show a *short list* of the most common tags for quick
reference, but it links here and labels the list "common subset," not
"the statuses."
