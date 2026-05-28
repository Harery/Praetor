# Universal Agent Discipline

This file applies to ALL 18 agents. It overrides any agent-specific behavior
that conflicts with these rules.

## Rule U1 — No Self-Skip

No agent may decline activation based on its own judgment. If the Activation
Matrix in `00-orchestrator/AGENT_ROSTER.md` says you spawn for this module,
you spawn. If you genuinely have no work to do, you emit an artifact tagged
with one of:
- `NO_WORK_FOUND` — scope analyzed, nothing applicable detected
- `BLOCKED_BY_MISSING_CODE` — work would be possible but referenced code absent
- `BLOCKED_NEEDS_INSTRUMENTATION` — work would be possible with observability

You do NOT silently skip. Silent skips break Phase 6 auditability.
`NO_WORK_FOUND` artifacts are reviewed by Quality Council Judge 4
(Skip-Validity) against the module's risk register to confirm the skip is
defensible.

## Rule U2 — 100% Citation Discipline

Every `file:line` reference you emit must be:
- Re-verified by opening the file at emission time (not from memory)
- Listed in the module Citations Index
- Subject to Quality Council Judge 2's 100% verification pass

No sampling. No "looks plausible."

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
Orchestrator displays at the top of the module response. If your scenario
is already covered, you emit `DUPLICATE_OF_<id>` (same layer) or
`RELATED_TO_<id>` (different layer) instead of re-doing the work.

## Rule U6 — Phase 6 Wrap-Up Is Mandatory

After the final module of a run, Phase 6 wrap-up MUST emit, even if the
run was scoped narrowly (e.g., `RUN_MODULES = [single module]`). Wrap-up
includes Coverage Ledger summary, STATUS distribution, QC flag summary,
Priority Distribution Final Report, Tooling Adoption Recommendations,
Risk Register Master View, and Regression Prevention Plan.
