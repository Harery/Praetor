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
| `DEFERRED_TO_<phase\|module>` | Intentionally postponed; out of scope. |

## Extended statuses (category-specific)

These are NOT ad-hoc — they are part of the protocol and pass U4. They exist
because some audiences need a precise reason a piece of work could not be done.

| Status | Used by | Meaning |
|---|---|---|
| `NO_WORK_FOUND` | any | Scope analyzed; nothing applicable. Triggers Judge 4. |
| `UNTESTABLE_AS_WRITTEN` | [ENG] | Code can't be tested in isolation; needs refactor. |
| `BLOCKED_NEEDS_INSTRUMENTATION` | [ENG]/[OPS] | Needs observability that doesn't exist yet. |
| `BLOCKED_BY_TEST_DATA` | [BIZ] UAT | Pre-setup state not achievable in staging. |
| `BLOCKED_NO_RESOLUTION` | [OPS] | Failure mode has no known remediation path. |
| `BLOCKED_NO_UI_PATH` | [SUP] | No user-facing path exists to reproduce. |
| `AUDIT_GAP` | [COMP] | Control claimed but no implementation evidence. |
| `OUT_OF_SCOPE` | any | Outside the declared run configuration. |
| `MANUAL_CONTROL` | [COMP] | Control is satisfied by a manual process, not code. |
| `QC_FAILED` | QC | Failed a Quality Council judge; reason attached. |
| `UNCORRECTABLE_DISTRIBUTION` | A02 | Priority bands genuinely can't be balanced. |
| `COMPLIANCE_CLAIM_UNVERIFIED` | A02/A16 | Compliance marker present, code absent. |

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

When any doc states a status count, it must say:
**"7 core statuses + extended set (see ARTIFACT_STATUS.md)"** rather than a
bare number that silently excludes the extended set.

The CHEATSHEET may show a *short list* of the most common tags for quick
reference, but it links here and labels the list "common subset," not
"the statuses."
