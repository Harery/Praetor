# Phase 1 — Technical Discovery

**Spawned agent**: A01 Discovery Agent (Principal Software Archaeologist).
**Wall-clock**: 2–10 min Claude time; silent. **Owner**: A01.

## v2 Changes
- Now driven by A01 with full charter and refusal conditions.
- A01 emits an **Audit Trail** at the start of Phase 3 (NEW — solves v1 Gap #2).
- Layer classification carries confidence tags (CONFIRMED/INFERRED/UNKNOWN).
- A01 refuses repos >2000 files without RUN_MODULES override.

See `07-agents/AGENT_discovery.md` for the full charter.

The 11 discovery sweeps (inventory, stack, layer, framework, test tooling,
structural, existing tests, modules, non-functional, data, cross-cutting)
are all owned by A01 in v2 rather than the orchestrator.
