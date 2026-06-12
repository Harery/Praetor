<!-- Praetor — Production Readiness Audit Skill
     Copyright (c) 2026 Mohamed Elharery (https://github.com/Harery). All rights reserved.
     Project repository: https://github.com/Harery/Praetor
     Licensed under the MIT License; see LICENSE at the repository root. -->

# Universal Agent Discipline

This file applies to ALL 17 specialist agents (A01–A17). It overrides any agent-specific behavior
that conflicts with these rules.

## Rule U1 — No Self-Skip

No agent may decline activation based on its own judgment. If the Activation
Matrix in `references/agents/AGENT_ROSTER.md` says you spawn for this module,
you spawn. If you genuinely have no work to do, you emit an artifact tagged
with one of:
- `NO_WORK_FOUND` — scope analyzed, nothing applicable detected
- `BLOCKED_BY_MISSING_CODE` — work would be possible but referenced code absent
- `BLOCKED_NEEDS_INSTRUMENTATION` — work would be possible with observability

You do NOT silently skip. Silent skips break Phase 6 auditability.
`NO_WORK_FOUND` artifacts are reviewed by Quality Council Judge 4
(Skip-Validity) against the module's risk register to confirm the skip is
defensible.

## Rule U2 — Citation Discipline

Every `file:line` reference you emit must be:
- Re-derived by opening the file at emission time (not from memory)
- Listed in the module Citations Index
- Subject to Quality Council Judge 2's re-derivation pass

No deliberate sampling; no "looks plausible." Re-derivation is a single-model
discipline, not external certification — the Citations Index is a reviewed
draft for human spot-check, not a guarantee of zero error.

## Rule U3 — No Output Abbreviation

You emit your full scope output. The Orchestrator never says "summarized
for readability" or skips your output. If output would exceed token budget,
the Orchestrator invokes CHUNKING_PROTOCOL.

## Rule U4 — Status Tag Discipline

Every artifact you emit carries exactly one status from the protocol:
- `READY`
- `READY_EXPOSES_BUG`
- `INFERRED`
- `BLOCKED_BY_MISSING_CODE`
- `DUPLICATE_OF_<id>`
- `RELATED_TO_<id>`
- `DEFERRED_TO_<x>`
- (extended values per category — see `ARTIFACT_STATUS.md`)

You do NOT invent ad-hoc tags. If the existing values don't fit your case,
raise it via HANDOFF to the Orchestrator for protocol extension.

## Rule U5 — Coverage Ledger Awareness

Before emitting an artifact, you check the Coverage Ledger that the
Orchestrator displays in the `## Coverage Ledger Check` section of the module
response (before any category section). If your scenario
is already covered, you emit `DUPLICATE_OF_<id>` (same layer) or
`RELATED_TO_<id>` (different layer) instead of re-doing the work.

## Rule U6 — Phase 6 Wrap-Up Is Mandatory

After the final module of a run, Phase 6 wrap-up MUST emit, even if the
run was scoped narrowly (e.g., `RUN_MODULES = [single module]`). The wrap-up
sections are defined canonically in `references/phases/PHASE_6_wrap_up.md`
(currently 15 sections) — that file's list governs; this rule only makes the
wrap-up itself non-skippable. (A run scoped to end before Phase 4 — e.g.,
`RUN_PHASES = [0,1,2,3]` — generates no modules, so there is no "final
module" and U6 is satisfied vacuously; see
`references/execution/RUN_MODES.md` for the binding rule.)
