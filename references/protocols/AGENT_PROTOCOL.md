<!-- Praetor — Production Readiness Audit Skill
     Copyright (c) 2026 Mohamed Elharery (https://github.com/Harery). All rights reserved.
     Project repository: https://github.com/Harery/Praetor
     Licensed under the MIT License; see LICENSE at the repository root. -->

# Agent Protocol — How Agents Communicate

Agents do not directly call each other. They communicate via:
1. **Shared Registers** — read-only after Phase 2 for every agent EXCEPT A02.
   A02 retains sole write authority and may amend registers post-gate in two
   cases: (a) a `correct:` / `continue with:` reply at the Phase 3 gate, and
   (b) a Phase-4 `A02 → All` re-link HANDOFF (e.g., backfilling a `UX-NNN`
   entry a cross-layer test relies on — see A02 Rule 6). No other agent writes.
2. **Coverage Ledger** — append-only across the run
3. **Handoff Messages** — declared in each agent's charter
4. **Orchestrator routing** — the Orchestrator marshals dispatch

## Message Types

```
DISPATCH    Orchestrator → Agent ("work on module M_X, category CAT-A")
FINDING     Agent → Orchestrator (artifact emitted)
HANDOFF     Agent → Agent (via Orchestrator)
BLOCK       Agent → Orchestrator (cannot proceed; reason given)
ESCALATE    Agent → Quality Council (need review pre-emit)
REWORK      Quality Council → Agent (failure tag + reason)
```

HANDOFF's full format lives in `references/protocols/HANDOFF_PROTOCOL.md`.
BLOCK and ESCALATE use these minimal formats (the others are one-liners):

```
BLOCK
From: <Agent ID>
Blocked work: <artifact ID or scope description>
Reason: <one line — what is missing and the status tag that applies>

ESCALATE
From: <Agent ID>
Artifact: <ID>
Question for QC: <one line — what needs ruling before emit>
```

## Handoff Examples

```
A06 → A17: CRITICAL finding (JWT_SECRET fallback) needs risk register entry
A14 → A12: triage tree branch dead-ends; need runbook RB-M_AUTH-...
A09 → A06: fuzz test surfaced a crash; treat as security issue
A07 → A13: defined SLO budget; need fast/slow burn-rate alerts
A16 → A06: SOC2 CC6.1 control needs technical evidence
A04 → A07: function is in hot path; needs perf coverage
```

## No-Direct-Call Rule

Agents NEVER reference another agent's output by re-reading source. They read:
- Registers (A02's output; read-only for every agent except A02 — see §1
  above for A02's two post-gate amendment cases)
- Coverage Ledger (Orchestrator-maintained, append-only)
- Handoff messages routed by Orchestrator

This prevents duplicate work and circular dependencies.
