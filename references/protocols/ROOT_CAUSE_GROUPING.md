<!-- Praetor — Production Readiness Audit Skill
     Copyright (c) 2026 Mohamed Elharery (https://github.com/Harery). All rights reserved.
     Project repository: https://github.com/Harery/Praetor
     Licensed under the MIT License; see LICENSE at the repository root. -->

# Root Cause Grouping Protocol

When multiple tests target symptoms of the same underlying bug, they share
a Root Cause ID. This keeps bug counts distinct from test counts.

## The Problem This Solves

A test agent may emit several tests for what is functionally one defect.
For example, "missing `<label>` elements" might generate two tests — one
per input field. Without grouping, Phase 6 status distribution would show
two `READY_EXPOSES_BUG` items reading as two bugs, when it is one bug with
two symptoms.

## The Solution

Every artifact gets an optional `ROOT_CAUSE` field. Artifacts that test
symptoms of the same underlying bug share a `ROOT_CAUSE` value. Phase 6
aggregates by root cause as well as by test count.

## Format

```
| TC ID | Audience | Priority | Status | Agent | Root Cause | ... |
| TC-M_FRONTEND-A11Y-LABEL-001 | [ENG] | P0 | READY_EXPOSES_BUG | A08 | RC-M_FRONTEND-001 | ... |
| TC-M_FRONTEND-A11Y-LABEL-002 | [ENG] | P0 | READY_EXPOSES_BUG | A08 | RC-M_FRONTEND-001 | ... |
| TC-M_FRONTEND-A11Y-KEYBOARD-001 | [ENG] | P0 | READY_EXPOSES_BUG | A08 | RC-M_FRONTEND-002 | ... |
```

## Root Cause ID Scheme

```
RC-<MODULE>-<NNN>
```

NNN is sequential per module. Each RC has a single canonical risk register
entry it ties to.

## Ownership

The Risk Agent (A17) owns the RC catalog. Other agents request RC assignment
via handoff when they emit multiple tests for symptoms of one cause:

```
HANDOFF
From: A08
To: A17
Reason: 2 tests target same root cause (missing <label> elements)
Linked artifact(s): TC-M_FRONTEND-A11Y-LABEL-001, TC-M_FRONTEND-A11Y-LABEL-002
Required output: assign shared RC-<MODULE>-<NNN>
Priority: P0
```

A17 assigns the next RC ID, links it to the risk register entry, and
notifies the requesting agent.

**Single-test bugs:** a lone test exposing a bug (no sibling symptoms) uses
the same handoff — A17 assigns the RC and ties it to the risk entry. When the
bug is already 1:1 with an `RR-` entry created in the same pass, A17 may
assign the RC inline while creating the RR (one handoff, two IDs); the test's
`ROOT_CAUSE` field is filled either way so Phase 6 aggregation counts it.

**Cross-module root causes:** RC IDs are module-scoped. When the same
underlying defect (e.g., a shared library bug) surfaces in multiple modules,
A17 keeps one RC per module but links them: each later RC's risk entry
carries a `RELATED_TO` reference naming the first module's RC, and Phase 6
Root Cause Aggregation counts the linked set as ONE distinct bug, noting the
modules it spans.

## When ROOT_CAUSE Is Optional

For tests in `READY` status with no associated bug, the field is omitted
(not blank — omitted). RC IDs exist only for tests that expose bugs or
correspond to risk register entries.

## Phase 6 Aggregation Rule

Wrap-up status distribution reports two counts:

```
STATUS Distribution (artifact count):
- READY: 47
- READY_EXPOSES_BUG: 14 (test count)
- DUPLICATE_OF: 3
- RELATED_TO: 2

Root Cause Aggregation:
- Distinct bugs exposed: 10 (not 14 — some bugs have multiple test cases)
- See Risk Register Master View for the 10 unique root causes.
```

This gives both the test-coverage view (14 tests) and the bug-count view
(10 distinct issues).
