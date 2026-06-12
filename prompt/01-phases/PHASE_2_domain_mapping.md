# Phase 2 — Domain Mapping & Tooling Discovery

**Owner**: Orchestrator A00 (dispatches and consolidates; silent until Phase 3).
**Spawned agents**:
- A02 Domain Mapping Agent (Domain-Driven Design Lead)
- A03 Tooling Discovery Agent (DevOps Tools Architect)

Both are dispatched together (sequentially simulated). Silent until Phase 3.

## v2 Changes
- **A03 is new** — detects org tooling (CI, monitoring, ticketing, help-desk,
  feature flags) and instructs downstream agents on format adaptation.
  Solves v1 Gap #10 (artifacts assumed help-desk tooling not all teams have).
- A02 now ENFORCES priority distribution (solves v1 Gap #9). It runs the
  15-30/30-50/30-50 check after populating registers and rebalances if skewed.

See `07-agents\/AGENT_domain_mapping.md` and `07-agents\/AGENT_tooling_discovery.md`.
