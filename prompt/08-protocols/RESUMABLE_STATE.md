# Resumable State Protocol (halt → resume)

> Purpose: `halt` must leave enough state behind that a later session can
> continue without re-running discovery. This protocol defines a compact,
> paste-back snapshot for that.

## When it emits

Whenever the user replies `halt` at the Phase 3 gate, OR at any module
boundary (after an `--- END MODULE ---` marker). The Orchestrator emits a
**Resumable Snapshot** as the final block before stopping.

## Why it's needed

Claude's context resets between sessions. Without a snapshot, resuming means
re-supplying the source AND re-deriving discovery, registers, and the
Coverage Ledger — wasteful and non-deterministic. The snapshot lets a new
session skip rediscovery and continue exactly where it stopped.

## Snapshot format

The snapshot is plain text the user copies and pastes back (after the master
prompt + source) to resume. It is intentionally compact — register *summaries*
and IDs, not full register bodies.

```
=== PRAETOR RESUMABLE SNAPSHOT v2.5 ===
SOURCE: <github URL | path>   COMMIT/SNAPSHOT: <sha or date>
RUN_CONFIG: PHASES=[...] CATEGORIES=[...] PRIORITIES=[...] MODULES=[...]
STOPPED_AT: <phase 3 gate | end of module M_X (n of N)>

# Discovery (so A01 need not re-run)
MODULES: M_AUTH(P0), M_BILLING(P0), M_USERS(P1), ...
STACK: <languages/frameworks/deps detected>
TEST_TOOLING_MODE: <EXTEND | GAP-FILL | REPLACE>
TOOLING_PROFILE: <CI=..., monitoring=..., ticketing=...> (CONFIRMED/INFERRED)

# Registers (IDs + one-line each; confidences carried)
BR: BR-001..BR-0NN (k CONFIRMED, j INFERRED)   [list any still-INFERRED IDs]
WF: WF-001..WF-0NN
... (all 12 registers, summary form)
PRIORITY_DISTRIBUTION: P0 x%, P1 y%, P2 z%  [in-band? Y/N]

# Confirmed answers from the gate
Q1=<answer or unknown>  Q2=<...>  (these were CONFIRMED this session)

# Coverage Ledger (so dedup survives the resume)
COVERED_MODULES: M_AUTH, M_BILLING
EMITTED_IDS: TC-M_AUTH-..., RR-M_AUTH-001, FX-M_AUTH-...
NEXT_MODULE: M_USERS (3 of 7)
=== END SNAPSHOT ===
```

## Resume procedure

On a new session the user pastes: master prompt + source + this snapshot.
The Orchestrator then:

1. Treats `MODULES`, `STACK`, `TOOLING_PROFILE` as A01/A03 output — does NOT
   re-run Phase 1/2 from scratch (it MAY spot-verify against the live source
   and flag drift if the commit differs).
2. Restores register IDs and confidences; treats listed `Q*` answers as
   CONFIRMED.
3. Restores the Coverage Ledger from `EMITTED_IDS` so `DUPLICATE_OF` /
   `RELATED_TO` still work.
4. Resumes at `NEXT_MODULE`, skipping everything already covered.

## Integrity rules

- If `COMMIT/SNAPSHOT` in the snapshot ≠ the live source, the Orchestrator
  emits a `SNAPSHOT_DRIFT` warning and asks whether to re-discover changed
  modules before continuing. It does NOT silently trust a stale snapshot.
- The snapshot never contains secrets, file *contents*, or `file:line` bodies
  — only IDs, summaries, and config. (Consistent with A06 secret posture.)
- A snapshot is advisory, not authoritative: registers can still be corrected
  via `correct: ... then continue` on resume.

## Relationship to RUN_MODES "Combining Recipes Across Sessions"

`05-execution/RUN_MODES.md` already tells users to save the Discovery Report
and re-supply source across sessions. This protocol formalizes that into a
structured, paste-back block and extends it to mid-run (per-module) resumption,
not just discovery-only.
