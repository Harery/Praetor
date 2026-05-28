# Agent Protocol — How Agents Communicate

Agents do not directly call each other. They communicate via:
1. **Shared Registers** — read-only after Phase 2 (only A02 writes)
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
- Registers (A02's output, frozen after Phase 3)
- Coverage Ledger (Orchestrator-maintained, append-only)
- Handoff messages routed by Orchestrator

This prevents duplicate work and circular dependencies.
