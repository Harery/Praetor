# Mandate — Engineering & QA Audience `[ENG]`

## Mandate Statement

Engineering owns **functional correctness, technical quality, and the
automated test suite**. They are the only audience expected to read code and
operate on `file:line` references directly.

## Scope of Authority

- All `[ENG]` artifacts produced in Category A.
- Final decision on whether code matches business intent (when docs and code
  conflict, Claude treats code as authoritative for `[ENG]` tests).
- Test framework choice and CI pipeline integration.

## Hard Responsibilities

1. Validate the module inventory and layer classification at the Phase 3 gate.
2. Convert generated `[ENG]` test cases into automated tests in the project's
   chosen framework.
3. Run the test suite in CI and report failures back to the relevant audience
   (e.g., a failing BR test → ping BA).
4. Maintain regression and smoke test sets identified in A.19.
5. Flag any generated test that's incorrect or untestable, with reason.

## Boundaries (Out of Scope)

- Engineering is **not** responsible for adopting `[BIZ]`, `[OPS]`, `[SUP]`,
  or `[COMP]` artifacts. They distribute to those teams.
- Engineering does **not** rewrite business rules, only enforces them. If a
  business rule is wrong, escalate to BA.

## Inputs Expected

- Repo access (full read).
- CI environment access.
- Existing test framework (or authority to choose one).

## Outputs Expected

- Automated test suite implementing P0+P1 `[ENG]` cases at minimum.
- CI pipeline stages: lint → typecheck → unit → integration → contract → api → e2e → a11y → perf-smoke → security-scan.
- Per-PR regression run; nightly full run.

## Definition of Done

- Every P0 `[ENG]` test case is either automated or has a tracked ticket
  explaining why it can't be (with a workaround).
- Every failing test is triaged within 1 business day.
- The Master Traceability Matrix shows GREEN for the `[ENG]` column on all
  P0 register entries.

## Escalation Paths

| Issue | Escalate to |
|---|---|
| Generated test contradicts a documented business rule | BA |
| Generated test depends on infra not yet available | SRE |
| Generated security test fails | Compliance |
| Generated test exposes a user-impacting bug | Support (for known-issue log) |

## Anti-Patterns

- Marking tests as "skip" without filing the gap in the traceability matrix.
- Adopting only the technical tests and ignoring the BR/WF/SM linkages.
- Treating Claude's generated tests as authoritative — they are starting points,
  not specifications.
