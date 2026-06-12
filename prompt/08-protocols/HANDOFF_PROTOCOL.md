# Handoff Protocol

## Purpose

Defines how agents request work from each other (always via Orchestrator).

## Handoff Message Format

```
HANDOFF
From: <Agent ID>
To: <Agent ID>
Reason: <one line>
Linked artifact(s): <ID(s) if applicable>
Required output: <what the receiving agent needs to produce>
Priority: <P0/P1/P2>
```

Worked example:

```
HANDOFF
From: A06
To: A17
Reason: CRITICAL finding — JWT signing key has a hardcoded fallback
Linked artifact(s): TC-M_AUTH-SEC-JWT_FALLBACK-001
Required output: Risk register entry with rotation guidance
Priority: P0
```

## Common Handoffs

| From → To | Trigger | Required Output |
|---|---|---|
| A14 → A12 | Triage tree branch needs RB | Runbook for the failure mode |
| A06 → A17 | CRITICAL security finding | Risk register entry |
| A06 → A16 | Auth test = SOC2 evidence | Control mapping update |
| A04/A05 → A07 | Function in hot path | Perf coverage |
| A09 → A06 | Fuzz-found crash | Security review |
| A16 → A06 | SOC2 control needs evidence | Security test |
| A07 → A13 | SLO defined | Burn-rate alerts |
| A13 → A12 | New alert needs RB | Runbook |
| A02 → All | Register entry update post-gate | Re-link if affected |

## Routing Rules

- Orchestrator routes handoffs synchronously within a module. The
  `A02 → All` register-update broadcast is the one exception: it routes
  across all remaining modules (per `08-protocols/AGENT_PROTOCOL.md` §1).
- Receiving agent acknowledges with FINDING or BLOCK message
- If receiving agent BLOCKS, originator must either:
  (a) accept the block (emit dependent artifact as BLOCKED status), or
  (b) escalate to Quality Council
- **No open handoffs at module end.** Every handoff resolves within the same
  module response — as a FINDING, an accepted BLOCK (dependent artifact
  emitted with its BLOCKED status and the blocker named), or a QC escalation.
  A handoff cannot deadlock by waiting: if the receiving agent cannot produce
  the required output in this module, that IS a BLOCK, and the originator
  takes path (a) or (b) before the module emits. Any handoff still unresolved
  at a `halt` is recorded in the snapshot's `PENDING_HANDOFFS` line.
