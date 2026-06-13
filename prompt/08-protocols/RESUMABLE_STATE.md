# Resumable State Protocol (halt → resume)

> Purpose: `halt` must leave enough state behind that a later session can
> continue without re-running discovery. This protocol defines a compact,
> paste-back snapshot for that.

## When it emits

Whenever the user replies an **explicit `halt`** — at the Phase 3 gate, at a
module boundary (after an `--- END MODULE ---` marker), or at a partial-module
marker (mid-chunk, per `08-protocols/CHUNKING_PROTOCOL.md`). The
Orchestrator emits a **Resumable Snapshot** as the final block before
stopping. Only the explicit `halt` keyword triggers a snapshot; a session that
simply ends without a reply leaves no snapshot behind.

## Why it's needed

The model's context resets between sessions. Without a snapshot, resuming means
re-supplying the source AND re-deriving discovery, registers, and the
Coverage Ledger — wasteful and non-deterministic. The snapshot lets a new
session skip rediscovery and continue exactly where it stopped.

## Snapshot format

> **Version-marker policy (v2.7.4):** embedded markers — this snapshot header
> and the Cheat Sheet title — track the **minor family only** (`v2.7`), not the
> patch (`2.7.3`, `2.7.4`, …). Snapshots are resume-compatible across patches
> within a family; `SNAPSHOT_DRIFT` compares the SNAPSHOT_TOKEN (source state),
> never the kit patch level. Bump embedded markers only on a minor/major bump.

The snapshot is plain text the user copies and pastes back (after triggering
the Praetor skill and supplying the source) to resume. It is intentionally
compact — register *summaries* and IDs, not full register bodies.

```
=== PRAETOR RESUMABLE SNAPSHOT v2.8.2 ===
SOURCE: <github URL | path>   SNAPSHOT_TOKEN: <sha | upload-date | content-fingerprint>
RUN_CONFIG: RUN_PHASES=[...] RUN_CATEGORIES=[...] RUN_PRIORITIES=[...] RUN_MODULES=[...]
STOPPED_AT: <phase 3 gate | end of module M_X (n of N) | mid-module M_X (categories A,B done; C,D,E pending)>

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
QC_FAILED_IDS: <IDs that emitted with QC_FAILED, with one-word reason each — or none>
PENDING_HANDOFFS: <in-flight HANDOFF chains not yet resolved — or none>
NEXT_MODULE: M_USERS (3 of 7)
=== END SNAPSHOT ===
```

Field notes: `RUN_CONFIG` uses the same `RUN_*` names as the gate override
syntax (`05-execution/RUN_MODES.md`) — they are the same values, not a
second vocabulary. The mid-module `STOPPED_AT` form is used when `halt`
arrives at a partial-module (chunk) marker; on resume the Orchestrator
re-enters that module at the first pending category.

## Resume procedure

On a new session the user triggers the Praetor skill, supplies the source, and pastes this snapshot.
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

- If the `SNAPSHOT_TOKEN` in the snapshot ≠ the live source's recomputed token,
  the Orchestrator emits a `SNAPSHOT_DRIFT` warning and asks whether to
  re-discover changed modules before continuing. It does NOT silently trust a
  stale snapshot. For local non-git sources the token is the Phase 0 content
  fingerprint (file count + total bytes + newest mtime, plus — when a shell is
  available — a SHA-256 of the sorted path+size manifest); a change in any
  component triggers the drift warning. Known limitation: without the manifest
  hash, an add+delete pair that preserves count, bytes, and newest mtime
  collides — low probability, not zero; the manifest hash closes it.
- Tamper awareness (soft integrity check): the snapshot is user-editable by
  design (corrections are legitimate), so it carries no enforced signature.
  When a pasted snapshot contains internally inconsistent state (e.g., an
  `EMITTED_IDS` entry for a module not in `COVERED_MODULES`, or a confidence
  upgrade with no matching `Q*` answer), the Orchestrator flags the
  inconsistency and asks before trusting it — it never silently repairs.
- The snapshot never contains secrets, file *contents*, or `file:line` bodies
  — only IDs, summaries, and config. (Consistent with A06 secret posture.)
- A snapshot is advisory, not authoritative: registers can still be corrected
  via `correct: ... then continue` on resume.

## Relationship to RUN_MODES "Combining Recipes Across Sessions"

`05-execution/RUN_MODES.md` already tells users to save the Discovery Report
and re-supply source across sessions. This protocol formalizes that into a
structured, paste-back block and extends it to mid-run (per-module) resumption,
not just discovery-only.
