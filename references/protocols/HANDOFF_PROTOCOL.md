<!-- Praetor — Production Readiness Audit Skill
     Copyright (c) 2026 Mohamed Elharery (https://github.com/Harery). All rights reserved.
     Project repository: https://github.com/Harery/Praetor
     Licensed under the MIT License; see LICENSE at the repository root. -->

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

## Canonical Handoff Registry — the complete directed graph

> **This table is the single source of truth for every inter-agent
> dependency.** It is the *complete* set of directed edges, not a "common
> subset." Each agent's charter Handoffs section lists only the edges that
> agent **initiates** (its outbound edges) — by design, to avoid maintaining
> the same edge in two charters that then drift. To see what any agent
> *receives*, read the `To` column here. A charter never needs to redeclare
> an inbound edge; this registry is its authoritative inbound view.

| # | Initiator → Receiver | Trigger | Required output |
|---|---|---|---|
| 1 | A01 → All (broadcast) | Discovery complete | Module inventory + layer map as ambient context |
| 2 | A02 → A10 | BR/WF/ROLE registers ready | Plain-language translation |
| 3 | A02 → A14 | ERR/UX/SM registers ready | Customer-facing translation |
| 4 | A02 → A16 | COMP/PRV registers ready | Control + PII mapping |
| 5 | A02 → A17 | All registers ready | Cross-cutting risk scan |
| 6 | A02 → All Tier-2 (broadcast) | INV/SM/ERR registers ready | Test linkage |
| 7 | A02 → All (broadcast) | Register update post-gate | Re-link if affected |
| 8 | A03 → All (broadcast) | Tooling profile ready | Format adaptation context |
| 9 | A03 → A06 | Secrets encountered in detection | Scan + rotation guidance |
| 10 | A03 → A12 | Monitoring/incident tool detected | Diagnostic-command syntax |
| 11 | A03 → A13 | Monitoring tool detected | Alert-query syntax |
| 12 | A03 → A14 | Help-desk tool detected | Support-artifact format |
| 13 | A04 → A05 | Cross-component flow | Integration coverage |
| 14 | A04 → A06 | Input-validation function | Security review |
| 15 | A04 → A07 | Hot-path function | Perf coverage |
| 16 | A04 → A09 | Parser/validator/serializer | Property-based tests |
| 17 | A05 → A06 | AuthN/Z flow integration test | Security cross-validation |
| 18 | A05 → A12 | Webhook failure mode | Runbook |
| 19 | A05 → A17 | Missing tenant isolation | P0 risk entry |
| 20 | A06 → A17 | CRITICAL security finding | Risk register entry |
| 21 | A06 → A16 | Auth test = SOC2 evidence; OR CRITICAL/HIGH finding with no COMP-NNN anchor | Control mapping (new if orphan finding) |
| 22 | A06 → A12 | Credential-leak / account-takeover scenario | Incident runbook |
| 23 | A07 → A12 | Bottleneck / headroom finding | Capacity & scaling notes (C.5) |
| 24 | A07 → A13 | SLO budget defined | Burn-rate alerts |
| 25 | A07 → A17 | N+1 / unbounded query | Tech-debt risk |
| 26 | A08 → A04 | Component render test | a11y assertions added |
| 27 | A08 → A05 | E2E test | axe-scan checkpoints |
| 28 | A08 → A16 | WCAG finding | ADA/EN 301 549/508 mapping |
| 29 | A08 → A17 | WCAG-blocking issue | Risk entry (+ shared RC for symptom clusters) |
| 30 | A09 → A06 | Fuzz-found crash | Security review |
| 31 | A09 → A05 | Chaos implies missing retry/breaker test | A.8 integration coverage |
| 32 | A09 → A12 | Chaos-discovered failure mode | Runbook |
| 33 | A09 → A17 | Chaos-found bug | P0/P1 risk |
| 34 | A10 → A11 | Workflow-level validation | UAT script |
| 35 | A10 → A14 | BR with customer-facing impact | Support content |
| 36 | A10 → A17 | Business risk | Risk entry |
| 37 | A10 → A02 | BR untestable / mis-stated | Register correction (A02→All re-link) |
| 38 | A11 → A10 | UAT IDs ready | BR validation matrix cross-link |
| 39 | A11 → A14 | UAT scripts ready | What customers might see |
| 40 | A12 → A13 | Runbook trigger needs alert | Alert definition |
| 41 | A12 → A06 | Credential-leak runbook needs security input | Security posture |
| 42 | A12 → A17 | Failure mode without runbook | P0/P1 risk |
| 43 | A13 → A12 | New alert needs runbook (A12 emits first; A13 links to the emitted RB-ID) | Runbook |
| 44 | A13 → A07 | Perf-based alert needs budget | Perf threshold |
| 45 | A13 → A17 | Undefinable alert | Observability risk |
| 46 | A14 → A12 | Triage branch dead-ends | Runbook |
| 47 | A14 → A15 | Escalation outcome | Comm template |
| 48 | A14 → A17 | Issue class with no path | P0/P1 risk |
| 49 | A15 → A14 | Comm templates ready | Cited in escalation trees |
| 50 | A16 → A06 | Control needs technical evidence | Security test |
| 51 | A16 → A17 | Audit gap | Risk entry |
| 52 | A16 → A11 | Process control | UAT verification |
| 53 | A17 → A12 | Risk needs operational response | Runbook |
| 54 | A17 → A16 | Risk is also an audit gap | Control mapping |
| 55 | A17 → A15 | Customer-facing risk | Pre-emptive comm |

### Broadcast handoffs (edges 1, 6, 7, 8)

Tier-1 outputs (A01 inventory, A03 tooling) and A02's register set are
**ambient context**: they are available to every downstream agent without a
per-recipient acknowledgment. A receiver does not declare an inbound edge for
a broadcast; consuming the registers/inventory/profile is assumed. This is
why no Tier-2/3/4 charter lists "(Inbound, from A01)" — broadcasts are the
floor every agent stands on, not point-to-point requests.

### Circular pairs — who initiates

Three pairs name each other (A06↔A12, A12↔A13, A07↔A13). They are not
deadlocks; each has a defined first-mover:

- **A12 ↔ A13:** A12 emits runbooks first; A13 then links each alert to an
  emitted `RB-ID`. If A13 needs an alert whose runbook doesn't exist yet, it
  emits `BLOCKED_PENDING_RUNBOOK` (edge 40 is the request; edge 43 is the
  fulfillment).
- **A06 ↔ A12:** A06 requests the incident runbook (edge 22); A12 requests
  A06's security posture when writing a credential-leak runbook (edge 41).
  A06 initiates when a finding exists; A12 initiates when authoring the RB.
- **A07 ↔ A13:** A07 hands a defined SLO budget to A13 (edge 24); A13 asks
  A07 for a threshold when defining a perf alert with no budget yet (edge 44).

## Routing Rules

- Orchestrator routes handoffs synchronously within a module. **Broadcast
  edges (1, 6, 7, 8) are the exception:** they are ambient and, for the
  `A02 → All` post-gate register update specifically, route across all
  remaining modules (per `references/protocols/AGENT_PROTOCOL.md` §1) — these
  are tracked in the snapshot's `PENDING_HANDOFFS` line, not resolved in one
  module.
- Receiving agent acknowledges with FINDING or BLOCK message.
- If receiving agent BLOCKS, originator must either:
  (a) accept the block (emit the dependent artifact with the **specific**
  `BLOCKED_BY_*` status from `references/protocols/ARTIFACT_STATUS.md` that
  names the cause — there is no bare `BLOCKED` tag), or
  (b) escalate to Quality Council.
- **No open point-to-point handoffs at module end.** Every non-broadcast
  handoff resolves within the same module response — as a FINDING, an accepted
  BLOCK (dependent artifact emitted with its specific `BLOCKED_BY_*` status and
  the blocker named), or a QC escalation. A handoff cannot deadlock by waiting:
  if the receiving agent cannot produce the required output in this module,
  that IS a BLOCK, and the originator takes path (a) or (b) before the module
  emits. Broadcast edges are exempt (they span modules); any point-to-point
  handoff still unresolved at a `halt` is recorded in `PENDING_HANDOFFS`.
