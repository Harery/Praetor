<!-- Praetor — Production Readiness Audit Skill
     Copyright (c) 2026 Mohamed Elharery (https://github.com/Harery). All rights reserved.
     Project repository: https://github.com/Harery/Praetor
     Licensed under the MIT License; see LICENSE at the repository root. -->

# Praetor Changelog Archive (v2.6 → v2.7.7)

> Historical entries moved here in v2.8.0 to keep `CHANGELOG.md` — and the
> context window of any model loading it — small. Recent entries live in
> `CHANGELOG.md` at the repository root. Load this file only when researching
> a past decision.

## v2.7.7 — Third Full-Kit Coherence Audit: User-Facing Vocabulary + Template Field Parity (2026-06-11)

Fresh-sandbox audit of v2.7.6: all 78 files copied to a clean workspace; both
harnesses executed live (green on first run; the F-A permission-stripped-copy
WARN fired as designed). Beyond the harness, a second-layer sweep ran:
dead-path scan across all referenced paths, escaped-pipe-aware table column
integrity (0 true mismatches; 9 prior hits were `\|` false positives),
roster-vs-charter persona parity (17/17 aligned), template-vs-SKILL field
parity, QC rework-rule consistency (SKILL / PHASE_5 / QC charter Rule 4 all
agree on the single-rework cycle), and 12-register parity across ID_SCHEMES,
REGISTERS, and GLOSSARY. Four findings — 2 MED, 2 LOW — all fixed and
re-verified.

| ID | Sev | Finding | Fix |
|---|---|---|---|
| H-01 | MED | **GLOSSARY omitted six user-facing run-mechanics terms** its own preamble promises to cover for BIZ/OPS/SUP readers: Audit Trail (the first user-visible output), Discovery Report, gate replies (`continue` / `halt` / `correct:` / `continue with:` / `continue module`), Resumable Snapshot (the block users copy-paste), and Citations Index (cohesion, bridging) | Six plain-language Cycle Terms entries added; gate-reply vocabulary now defined where non-technical readers will look for it |
| H-02 | MED | **E.1 Compliance Control template violated SKILL.md's own mandate** — "Every artifact carries … `LINKED_IDS`" — carrying Audience/Status/Agent/Priority but no Linked IDs row; the natural register linkage (its COMP-NNN marker) was undeclared (alignment, uniformity) | Template gains `Linked IDs: COMP-014 (SOC2 CC6.1 marker), BR-002` row between Priority and Framework |
| H-03 | LOW | **No declared bridge between canonical field tokens and rendered labels** — SKILL.md mandates `LINKED_IDS` while PHASE_4/CAT_A canonical tables and all five templates render `Linked IDs`; a strict voicer could read this as two vocabularies (precision, linkage) | SKILL.md Output Discipline now states tokens render as title-case labels per the PHASE_4 canonical table format |
| H-04 | LOW | **Both harness scripts shipped without their executable bit** (zip/copy artifact the F-A check itself WARNs about) (robustness) | `chmod +x` restored on `tools/check_consistency.sh` and `tests/sim/check_secrets.sh`; release zip built with permissions preserved |

Verified clean in the same session: dead-path scan (the sole hit,
`tests/perf/login-p99.k6.js` in A07's charter, is an illustrative artifact
path inside an example k6 script, not a kit path); RESUMABLE_STATE's
`2.7.3`/`2.7.4` mentions are the version-marker policy's own examples, not
drift; embedded markers stay at family `v2.7` per that policy.


## v2.7.6 — Second Full-Kit Coherence Audit + TC-Slot Checker Stage (2026-06-11)

Fresh-sandbox audit of v2.7.5: all 78 files copied to a clean workspace and
read end-to-end; both harnesses executed live (green on first run — the F-A
permission-stripped-copy WARN path fired exactly as designed). A second
closed-vocabulary sweep (status tags, ID slots, field names, handoff format,
template-vs-charter conformance) surfaced 14 findings — 2 MED, 12 LOW — all
fixed and re-verified. The headline class: the F-C "ID-scheme violations in
the kit's own examples" fix missed the TC `<LAYER>` slot, where four files
used undeclared tokens.

| ID | Sev | Finding | Fix |
|---|---|---|---|
| G-01 | MED | **TC IDs with undeclared `<LAYER>`-slot tokens** — `SEC` (COVERAGE_LEDGER ×2, PHASE_6), `INT` (COVERAGE_LEDGER), `A11Y` (ROOT_CAUSE_GROUPING ×3), `RBAC` (compliance template) — ID_SCHEMES declared the slot as Layer-Tag-only; COVERAGE_LEDGER even showed ID slug `SEC` beside Layer column `CONTROLLER` (fidelity, uniformity) | ID_SCHEMES now declares **Discipline Tags** (`SEC \| A11Y \| INT \| PERF \| I18N \| CHAOS`) as a legal third-slot alternative for cross-cutting tests, with the Layer column always carrying the canonical Layer Tag (dedup matching unchanged); the non-conformant `RBAC` example corrected to `TC-M_AUTH-SEC-RBAC-001` |
| G-02 | MED | **E.4 RR template violated A17's own charter**: no risk-lifecycle `Status` (Rule 4 — every RR carries exactly one), no effort estimate (Rule 2), no source-finding cross-reference (Rule 3) (integrity, fidelity) | Template gains `Status: OPEN`, a `Source Finding` trace line, and a dev-day effort bucket on the recommended mitigation |
| G-03 | LOW | ROOT_CAUSE_GROUPING prose called the field `ROOT_CAUSE_ID` (×3) while SKILL.md and CAT-A canonically name it `ROOT_CAUSE` (uniformity) | Renamed throughout the protocol prose |
| G-04 | LOW | The kit's only worked HANDOFF example omitted the mandatory `Priority:` field and used `Linked artifacts` vs the declared `Linked artifact` (precision) | Protocol field is now `Linked artifact(s)`; example gains `Priority: P0` |
| G-05 | LOW | A00 Rule 4 / COVERAGE_LEDGER / U5 said the Ledger Check sits "at the top of the module response" while PHASE_4's canonical structure places it after `## Module Context` (sequencing, coherence) | All three prose claims now read "before any category section, immediately after Module Context, per PHASE_4" |
| G-06 | LOW | PHASE_4's Ledger-Check parenthetical mentioned only `DUPLICATE_OF`, omitting `RELATED_TO` and the canonical block (linkage) | Parenthetical now cites COVERAGE_LEDGER's block and both reference types |
| G-07 | LOW | REGISTERS 2.1 narrowed the confidence enum to `(CONFIRMED/INFERRED)` vs FAILURE_RULES §7's 4-value vocabulary (uniformity — F-J class) | Schema now lists all four values with a §7 pointer |
| G-08 | LOW | SECRET_SCAN_MANDATE's CI block claimed to "amend" the CAT_A pipeline that declares itself canonical and already contains the stages; its copy also dropped CAT_A's `(P2)` on chaos (coherence, linkage) | Heading reworded to "convenience copy — canonical pipeline lives in CAT_A"; `(P2)` restored |
| G-09 | LOW | Two QC_FAILED formats — QUALITY_GATES' 4-field block vs the `QC Note:` one-liner in PHASE_5/QC charter — with no statement of when each applies (bridging, connectivity) | QUALITY_GATES now defines both forms and their contexts (standalone vs inline) |
| G-10 | LOW | TEST_FIXTURES wrote the linkage field as `Blocked-by:` while SKILL.md declares `BLOCKED_BY` (uniformity) | Protocol now uses `BLOCKED_BY: FX-<id>` |
| G-11 | LOW | Support-playbook D.3 example headers drifted from CAT-D's declared format (`ERR ID`/`Customer-facing translation` vs `Error code`/`Plain meaning`) (uniformity) | Template headers aligned with CAT-D |
| G-12 | LOW | The D.4 CT template block carried none of the five mandatory artifact fields (AUDIENCE/PRIORITY/STATUS/AGENT/LINKED_IDS) (integrity) | Fields added (`Agent: A15`, per roster ownership) |
| G-13 | LOW | A04's charter never named its owned test types while joint-A.19-owner A05's charter does (cohesion, alignment) | A04 Mandate gains the ownership sentence mirroring A05's, deferring to CAT-A's canonical map |
| G-14 | LOW | TEAM_ASSIGNMENTS RACI row "Run Claude prompt" predated skill invocation (continuity — F-M residue) | Row now "Run the Praetor skill" |

Hardening: `tools/check_consistency.sh` gains **stage 7** — every example
`TC-` ID's third slot must be a declared Layer Tag or Discipline Tag — so the
G-01 class is now machine-caught, not read-caught.

Verification: `tools/check_consistency.sh` (7 stages) → CONSISTENT;
`tests/sim/check_secrets.sh` → ALL PLANTED SECRETS CAUGHT; full re-read of
every touched file plus a second orphan/scheme/count/field-name sweep → zero
open findings. Embedded markers stay `v2.7` per the family-marker policy
(patch bump only). File count unchanged at 78.


## v2.7.5 — Full-Kit Coherence Audit (2026-06-10)

Sandbox audit of v2.7.4: all 78 files read end-to-end, both harnesses executed
live. Secret-scan regression stayed green throughout; the consistency checker
exposed its own packaging defect (F-A). 16 findings, all fixed and re-verified.

| ID | Sev | Finding | Fix |
|---|---|---|---|
| F-A | HIGH | Harness scripts shipped **without the executable bit**, so `tools/check_consistency.sh` stage 6 FAILed on every fresh copy/unzip — the checker's only false negative was itself (reliability, robustness) | Exec bits restored in the package; checker now runs the secret harness via `bash` with a WARN (not FAIL) when the bit is stripped by zip/copy, so a permission-stripped clone still validates |
| F-B | MED | **Five artifacts had no generating agent**: B.4, B.6 (CAT-B) and C.5, C.8, C.9 (CAT-C) appeared in the category catalogs but in no agent's Outputs; roster A04 also understated its canonical A.1/A.2/A.10/A.12/A.17 (+A.19 joint) scope (coverage, cohesion, alignment) | A10 now owns B.4 + B.6; A12 owns C.5 + C.8 + C.9 (A07/A06 feed via handoff); roster + both charters updated; CAT-B/CAT-C gained an agent-vs-human-owner note |
| F-C | MED | ID-scheme violations in the kit's own examples: `RC-FRONTEND-001` (ROOT_CAUSE_GROUPING), `RR-001` (A17), `RB-AUTH-001` (support-playbook template) — all break the formats ID_SCHEMES declares (fidelity, uniformity) | All three corrected to scheme-conformant IDs (`RC-M_FRONTEND-…`, `RR-M_AUTH-001`, `RB-M_AUTH-LOGIN_FAILURE-001`) |
| F-D | MED | PHASE_5 step 4 ("final emission tags artifacts with READY or QC_FAILED") implied QC overwrites status — contradicting A00 Rule 3 (status tags are sacred) (coherence) | Reworded: pass preserves the artifact's own STATUS; only post-rework failures carry `QC_FAILED` |
| F-E | MED | CITATIONS allowed `Re-derived = ✗` for claims "carried over without re-opening," contradicting U2 / Judge 2 "no deliberate sampling" (coherence, integrity) | ✗ redefined: re-derivation attempted but not completable (source out of context); every ✗ row flagged for human verification; never a skip-by-choice |
| F-F | LOW | BY_THE_NUMBERS markdown breakdown miscounted (67 reference files vs actual 66; omitted `tests/sim/flawed-app/README.md`) (precision) | Breakdown corrected; still sums to 78 |
| F-G | LOW | REGISTERS.md placed the Master Traceability Matrix "in Phase 5"; it is a Phase 6 wrap-up section (sequencing) | Corrected to Phase 6 |
| F-H | LOW | GLOSSARY sent leadership to a "Recommended Immediate Actions" Phase-6 section that doesn't exist (traceability) | Now points at the real sections: Priority-Banded Gap Report + Risk Register Master View |
| F-I | LOW | CONDITIONAL_CONTINUE Format 5 said "all three actions applied" over a two-block example (precision) | Reworded: every block present is applied; any of the three may combine |
| F-J | LOW | GLOSSARY `DEFERRED_TO_<module>` narrower than canonical `DEFERRED_TO_<target>` (uniformity) | Aligned with ARTIFACT_STATUS target semantics |
| F-K | LOW | `BLOCKED_NO_UI_PATH` "Used by" said [SUP] only while A10 [BIZ] uses it; A11's "same as A10" omitted its own `BLOCKED_BY_TEST_DATA` (uniformity) | ARTIFACT_STATUS row now `[SUP], [BIZ] A10`; A11 Rule 4 names its addition |
| F-L | LOW | AGENT_PROTOCOL's "frozen after Phase 3" shorthand contradicted the A02 post-gate exception two paragraphs above (coherence) | Shorthand now defers to §1's exception |
| F-M | LOW | TEAM_ASSIGNMENTS workflow jumped Phase 4 → Phase 6 with no bridge; "runs the prompt" predated skill invocation (continuity, transitioning) | Inline-Phase-5 note added; wording now "runs the Praetor skill" |
| F-N | LOW | CAT-A "Must-have (10 types)" header over an 11-row table (A.14b sub-type unannotated) (precision) | Header now "(10 types + the A.14b sub-type — 11 table rows)" |
| F-O | LOW | CHEATSHEET gate-reply list omitted the v2.7.4 Format-7 question carve-out (uniformity, bridging) | `<any question>` line added, matching the Phase 3 gate block |
| F-P | LOW | Confidence notation (FAILURE_RULES §7) had no cross-link from ARTIFACT_STATUS, leaving U4 readers without the second vocabulary (connectivity, linkage) | Cross-link added; INFERRED's dual role made explicit |

Verification: `tools/check_consistency.sh` → CONSISTENT; `tests/sim/check_secrets.sh`
→ ALL PLANTED SECRETS CAUGHT; full re-read of every touched file plus a second
orphan/scheme/count sweep → zero open findings. Embedded markers stay `v2.7`
per the family-marker policy (patch bump only).


## v2.7.4 — Live-Execution Audit + Harness Landing (2026-06-10)

First pass where every *static* claim re-derived clean — so this audit
**executed** the kit against a planted-flaw fixture repo (`tests/sim/flawed-app`,
8 known defects) and pointed the static battery at the surfaces v2.7.2/v2.7.3
declared clean. 6 findings; the headline one (P-01) was catchable ONLY by
running a pattern against real code, validating the long-standing "static
reading is exhausted" recommendation from the outside.

Crucially, this is the version that **lands the two harnesses** recommended
since v2.7.1/v2.7.2 instead of only recommending them.

| ID | Sev | Finding | Fix |
|---|---|---|---|
| P-01 | HIGH | **Secret-scan generic pattern is case-sensitive as written and misses the dominant JS convention.** `(api[_-]?key\|secret\|token)…` failed live against `const SECRET = "sk_live_…"`; only `-i` caught it — directly contradicting v2.7.3's "secret-lint regex still holds" (precision, robustness) | Mandatory case-insensitivity rule added to SECRET_SCAN_MANDATE; `(?i)` prepended on identifier-name patterns |
| P-02 | MED | **No payment-provider key class**, and the high-entropy floor (≥32) let a 30-char live-style key escape every row (coverage, precision) | Added `sk/pk/rk_(live\|test)_` + `whsec_` class (any `_live_` → auto-CRITICAL); entropy threshold lowered to ≥24 |
| P-03 | MED | **CHANGELOG v2.7.1 verification claim overstated.** "handoff table matches every charter's declared handoffs" — charters declare ~50 directed edges; the table holds 9 and self-describes as "Common Handoffs" (fidelity) | Claim amended in place to "no direction inversions; table is a declared subset" |
| P-04 | LOW | SKILL reference map still read "Audit changelog (v2.6 consistency fixes)" — 5 entries stale (traceability) | Updated to "v2.6 → v2.7.4 audit history"; added `tests/sim/` + `tools/` to the map |
| P-05 | LOW | Embedded markers (`v2.7`) vs manifest (`2.7.x`) had no stated family-vs-patch policy — T-03 itself framed snapshot drift as a traceability break (uniformity) | RESUMABLE_STATE documents: embedded markers track the **minor family only**; drift compares SNAPSHOT_TOKEN, never patch level |
| P-06 | LOW | Gate halt rule sent any non-keyword reply (incl. a clarifying question) to full halt + snapshot (robustness) | CONDITIONAL_CONTINUE Format 7 + Phase 3 gate: questions are answered in place, gate re-shown, no snapshot, no state loss |

### Harnesses landed (closes the 6-versions-deep recommendation)

- **`tests/sim/`** — planted-flaw fixture repo + `check_secrets.sh`, the
  red/green regression for the secret-scan mandate. Caught P-01 and P-02
  mechanically; now guards against their reintroduction.
- **`tools/check_consistency.sh`** — schema-conformance checker: dead-link
  scan, canonical counts (agents/phases/registers/protocols/ID-schemes),
  U4 closed-vocabulary assertion (every status tag/modifier flag used is
  declared in ARTIFACT_STATUS), and the family-marker policy. *(amended in v2.8.0: as shipped, stage 3 only inventoried the declared set and spot-checked five tokens; the real usage scan asserting every used token is declared landed in v2.8.0)* Invokes the
  secret-scan harness as its final stage. This check would have caught
  N-01/N-02/N-03 from v2.7.3 — the recurring "fix added an unratified token"
  family — at edit time. *(amended in v2.8.0: overstated — N-01 was a wrong-agent use of a DECLARED flag, which no token-membership scan catches; N-02/N-03 would have required the v2.8.0 usage scan, which did not exist as shipped)*

Both scripts exit non-zero on violation and are intended as the **mandatory
gate before any 2.8 feature work**. The static + runtime gaps are now both
covered automatically; the manual-reading audit cycle that introduced a fresh
defect every version since v2.7.1 is retired.

### Self-test

`tools/check_consistency.sh` → `RESULT: CONSISTENT`. `tests/sim/check_secrets.sh`
→ `ALL PLANTED SECRETS CAUGHT`. File count reconciled in BY_THE_NUMBERS (77).

## v2.7.3 — Fix-Surface Stress Audit (2026-06-10)

Targeted the code paths introduced by v2.7.1 + v2.7.2 — on the theory that the
freshest edits are the likeliest source of fresh defects. Re-executed the kit
focusing every newly-added rule (SNAPSHOT_TOKEN, A03 Rule 4b, A02 Rule 5b,
A01 layer inheritance, Blocked-Fixture Linkage) against inputs designed to
exercise them. 6 findings — all the recurring "fix introduced a term/field the
rest of the kit doesn't ratify" class (same family as T-08). All fixed.

| ID | Sev | Finding | Fix |
|---|---|---|---|
| N-01 | HIGH | **L-04 borrowed another agent's flag.** A03's new Rule 4b told it to emit a `PRIORITY_REBALANCE_NOTE`, but ARTIFACT_STATUS scopes that flag to **A02 only** — A03 using it is the exact U4 closed-vocabulary violation T-08 fixed (integrity) | Registered a proper `TOOL_AMBIGUITY_NOTE` (A03) modifier flag; Rule 4b now uses it |
| N-02 | MED | **L-03 wrote a DEP field that doesn't exist.** Rule 5b records `usage: declared-not-observed`, but the DEP-NNN schema has no `usage` column and its Sources line implies used deps only — the entry couldn't be represented in the register (fidelity, alignment) | DEP-NNN schema gains a `usage (observed / declared-not-observed)` column; Sources line now includes manifest entries |
| N-03 | MED | **L-05 introduced an unratified artifact field.** `Blocked-by: FX-<id>` is a new field absent from SKILL Output Discipline's mandatory/optional field set (connectivity) | Output Discipline now lists optional `BLOCKED_BY`, cross-linked to TEST_FIXTURES |
| N-04 | MED | **L-02 collided with PRIORITY_RUBRIC.** "Login UI = P0" (module inheritance) reads as contradicting the rubric's P1/P2 frontend *test* examples — module-criticality and artifact-priority are different axes but nothing said so (coherence) | PRIORITY_RUBRIC gains a "Module Criticality vs Artifact Priority" section: criticality drives scope order, priority drives release gating; a P0 module legitimately holds P1/P2 artifacts |
| N-05 | LOW | **L-04's rule had no matching example.** A03's Tooling Profile sample still showed single-tool monitoring, so the multi-tool path it now mandates was undemonstrated (uniformity) | Profile example updated to show Datadog (+ Sentry) → TOOL_AMBIGUITY_NOTE |
| N-06 | MED | **A09 non-activation is invisible.** A08 activates-then-declares `NO_WORK_FOUND` (always leaves a trace); A09 may silently never spawn on a P0-only non-critical run, so Phase 6 can't tell "ran, found nothing" from "never ran" (traceability, cohesion between the two conditional agents) | A09 records `not activated — <reason>` in the Coverage Ledger; Phase 6 §8 gains an "Agents Not Activated" line |

Confirmed clean under this pass: TOOL_AMBIGUITY_NOTE on a Tooling Profile is
informational placement (the Profile is a discovery output, not a U4-governed
TC/RB artifact); `correct:` at the gate correctly re-triggers A01/A02 update
(L-02 inheritance recomputes); the secret-lint regex and Judge logic from
prior passes still hold.

### Open recommendation (now 6 versions deep — escalating)

Every audit since v2.7.1 has found defects *introduced by the previous audit's
fixes*, all the same shape: an edit adds a term/field/flag in one file that the
schema, status registry, or field list elsewhere doesn't ratify. This is no
longer catchable by reading — it needs a **schema-conformance check**: a
machine-readable inventory of (status tags, modifier flags, artifact fields,
register columns) plus an assertion that every token used in any file is
declared in its registry. That check would have caught N-01, N-02, and N-03
mechanically. Pairing it with the `tests/sim/` fixture-repo harness (v2.7.2
rec) closes both the static and runtime gaps. Recommend building both before
any further feature edits.

## v2.7.2 — Live Sandbox Execution Audit (2026-06-10)

Unlike v2.6/v2.7/v2.7.1 (static cross-file consistency passes), this audit
**executed** the v2.7.1 kit as the Orchestrator against a planted-flaw repo
(5 modules: M_AUTH JWT-fallback secret, M_ORDERS IDOR, M_USERS GDPR-erasure
no-cascade, M_FRONTEND div-onClick + missing label; Stripe declared-but-unused;
Datadog+Sentry both present; local non-git source). Traced the full loop
Phase 0→6 plus a halt/resume cycle, recording every point where the protocol
left the Orchestrator without an instruction or contradicted itself at runtime.
5 runtime gaps found — all the kind static diffing cannot catch because each
only appears when real inputs hit the rules. All fixed.

| ID | Sev | Finding (surfaced by) | Fix |
|---|---|---|---|
| L-01 | HIGH | **Local non-git source has no snapshot token.** PHASE_0 records "commit SHA (or upload date)"; a local directory with no `.git` has neither. RESUMABLE_STATE's `SNAPSHOT_DRIFT` integrity check compares `COMMIT/SNAPSHOT` — for local sources it compares nothing, so drift detection silently no-ops on resume (robustness, continuity) | PHASE_0 now defines a 3-form `SNAPSHOT_TOKEN`: git SHA / upload date / content fingerprint (file count + bytes + newest mtime). Never empty. RESUMABLE_STATE format + integrity rule updated to recompute and compare the token for every source type |
| L-02 | MED | **Layer-criticality inheritance undefined.** A01's rubric makes the auth *controller* P0 but gives no rule for the login *frontend* serving that same P0 flow — Orchestrator can't consistently decide if M_FRONTEND is P0 or P1 (precision, consistency) | A01 rubric gains a "Criticality Inheritance Across Layers" rule: a UI module inherits the **highest** criticality of any flow it directly serves (login UI = P0, checkout UI = P0) |
| L-03 | MED | **Manifest-declared, code-unused dependency falls between two agents.** Stripe is in package.json but no code imports it (billing removed). A01's anti-pattern says reject misleading manifests *for layer classification*; A02's DEP register has no rule, so A01 drops it and A02 might list it — they disagree and the phantom payment SDK could vanish silently (alignment) | A02 gains Rule 5b: log the dep as `DEP-NNN` tagged `INFERRED / usage: declared-not-observed`, reconciled explicitly with A01's anti-pattern; surface in MUST CONFIRM when it would be P0 if real |
| L-04 | MED | **Two tools in one category, no tie-break.** Datadog (env-var name) AND Sentry (dependency) both detected for monitoring. A03's format-adaptation rules are single-tool branches ("if Datadog… if Prometheus…") with no rule for co-existence — alert-query format is undefined (robustness) | A03 gains Rule 4b: list all detected tools, choose the format-driver by evidence strength then artifact-scope fit (metrics→APM tool, errors→error tracker), state the choice and reason, emit both + flag when genuinely tied |
| L-05 | MED | **Test-on-blocked-fixture produces two disjoint blockers.** M_ORDERS tenant-isolation test needs a fixture, but no schema exists → fixture `BLOCKED_BY_MISSING_SCHEMA`, test `BLOCKED_BY_TEST_DATA`. Same root cause (missing schema) surfaces as two unrelated-looking blocked items with no linkage rule (cohesion, linkage) | TEST_FIXTURES gains a "Blocked-Fixture Linkage" rule: the test references its blocked fixture via `Blocked-by: FX-<id>`, expressing one root cause as fixture-blocker + test-dependency; unblocking the fixture unblocks all linked tests in one move |

Confirmed clean under live execution (no change needed): A09 always-spawns
logic under default `[P0,P1,P2]` is consistent between roster footnote and
Phase 4; the secret-lint `jwt-dev-fallback` regex actually matches the planted
`JWT_SECRET || 'dev-secret-fallback'` (char-counted the bounded quantifiers);
Judge 2 citation re-derivation lands on the right line; Judge 4 correctly
passes A08's NO_WORK_FOUND for the frontend-less auth module; the COVERAGE_LEDGER
RELATED_TO cross-layer example is illustrative (the repo has no order UI, as
expected); protocol count (13) and the v2.7.1 fixes all held.

### Open recommendation (carried, now 5 versions deep)

The `tools/check_consistency.sh` script recommended since v2.6 would NOT have
caught any of L-01…L-05 — these are runtime-semantic gaps, not path/count/tag
drift. The complement is a **fixture-repo harness**: keep the planted-flaw repo
used here in `tests/sim/` and dry-run the kit against it before each version
bump. Static checks catch what diffing catches; only execution catches the rest.

## v2.7.1 — Third-Pass Consistency Audit (2026-06-10)

Full 70-file re-read + simulated multi-module run (Phases 0→6, halt/resume,
chunked module, NO_WORK_FOUND skip path) against the 20 governance dimensions.
14 findings — 3 High, 8 Medium, 3 Low. All fixed. Two are regressions
introduced by v2.7's own fixes (S5 ordering; F-08 scope).

| ID | Sev | Finding | Fix |
|---|---|---|---|
| T-01 | HIGH | PHASE_6 section list ran 13 → **15** → 14: v2.7's S5 fix inserted the Fixture Report (15) *before* the Regression Prevention Plan (14), corrupting the mandatory wrap-up's emission order (sequencing) | Sections reordered 13 → 14 → 15 |
| T-02 | HIGH | Master-prompt invocation model survived F-08 in 7 locations across 5 files (RUN_MODES ×4, RESUMABLE_STATE resume procedure, CHEATSHEET recipes header, A00 charter title, GLOSSARY) — users would look for a MASTER_PROMPT.md that doesn't exist (continuity, fidelity) | All 7 rewritten for skill-based invocation *(amended in v2.8.0: an eighth, line-wrapped occurrence in RESUMABLE_STATE survived this fix and four later audits; fixed in v2.8.0 and now machine-checked by checker stage 10)* |
| T-03 | HIGH | Stale `v2.5` markers in a v2.7 kit: CHEATSHEET title and the Resumable Snapshot header (`=== PRAETOR RESUMABLE SNAPSHOT v2.5 ===`) — snapshot version drift breaks resume traceability (traceability) | Both bumped to v2.7 |
| T-04 | MED | U6's wrap-up enumeration omitted the two v2.7 additions (Fixture Report, Root Cause Aggregation) — UAD and PHASE_6 disagreed on what "mandatory wrap-up" contains (linkage) | U6 enumeration completed; PHASE_6 declared canonical |
| T-05 | MED | COVERAGE_LEDGER's DUPLICATE rule cited a 6-value layer vocabulary (UI / DATA / JOB) that doesn't exist in ID_SCHEMES' canonical 15 tags (uniformity) | Rule now cites canonical tags (FRONTEND_UI / REPOSITORY / SCHEDULER) |
| T-06 | MED | CAT_A's canonical Table Format lacked the `Status` and `Agent` columns that F-12 added to templates and PHASE_4 already carries; optional Root Cause column undocumented in both (alignment) | Columns added; optional RC column noted in CAT_A and PHASE_4 |
| T-07 | MED | ARTIFACT_STATUS attributed `BLOCKED_BY_TEST_DATA` to [BIZ] UAT only, while A05's charter ([ENG]) explicitly emits it (precision) | Used-by column now lists both |
| T-08 | MED | `DEFERRED_TO_<phase\|module>` registry parameter forbade in-use values `DEFERRED_TO_LAUNCH` (A10) and `DEFERRED_TO_GENERATOR` (A04) — a U4 violation by the kit's own files (integrity) | Parameter widened to `<target>` with milestone/owner examples |
| T-09 | MED | Roster called A08 a "WCAG AAA specialist" while the charter, CAT_A, CAT_E, and CHEATSHEET all standardize on WCAG 2.1 AA (coherence) | Roster aligned to 2.1 AA |
| T-10 | MED | BY_THE_NUMBERS "Total files 68" went stale the moment v2.7 added LICENSE + NOTICE (precision) | Now: 70 total (68 markdown + LICENSE + NOTICE) |
| T-11 | MED | TEAM_ASSIGNMENTS anti-pattern #1 still said "schedule the Phase 5 review before Phase 4" — an F-04 leftover from the v1 model where Phase 5 was the wrap-up (transitioning) | Corrected to Phase 6 wrap-up review |
| T-12 | LOW | Citations Index header "Used in" (CITATIONS.md) vs "Used in artifacts" (PHASE_4) (uniformity) | Unified to "Used in artifacts" |
| T-13 | LOW | A00 charter title referenced "running the master prompt" (covered under T-02) | Retitled to skill trigger |
| T-14 | LOW | GLOSSARY "the 7 phases the prompt runs through" (covered under T-02) | Reworded |

Confirmed clean this pass: activation matrix single-source rule holds across
roster/Phase 4; skip vocabulary closed (no NO_WORK_FOUND aliases anywhere);
all 31 v2.6 path fixes intact; handoff table has no direction inversions and
A06's inbound-from-A03 is correctly oriented *(amended in v2.7.4: the original
wording — "matches every charter's declared handoffs" — overstated; charters
collectively declare ~50 directed edges, the table holds 9 and self-describes
as "Common Handoffs", a declared subset)*; Test-Type Ownership Map matches
roster Outputs and A05's claimed scope; ID schemes (11) complete and used
consistently; priority bands consistent (15-30/30-50/30-50) in all four
citing files; chunking markers consistent; QC judge applicability consistent
across SKILL.md, PHASE_5, QUALITY_GATES, and the QC charter.

## v2.7 — Sandbox Simulation Audit + Attribution (2026-06-09)

Ran the v2.6 build as a live simulation against a planted-flaw test repo
(JWT fallback secret, IDOR, missing a11y label/div-onClick, GDPR erasure,
Stripe dependency) to catch execution-path gaps static checks miss. 5 runtime
findings — all connectivity/continuity/bridging class — fixed. Plus full
copyright/attribution to https://github.com/Harery and the project repo
https://github.com/Harery/Praetor.

| ID | Sev | Finding | Fix |
|---|---|---|---|
| S2 | MEDIUM | Phase 2 was the only phase file with no `**Owner**` line — broke the owner chain a reader follows phase-to-phase (continuity) | Added `**Owner**: Orchestrator A00` |
| S4 | MEDIUM | Phase 4's per-module response template had no Fixtures section, though TEST_FIXTURES mandates agents emit `FX-` seeds alongside every data-dependent test — fixtures would have nowhere to land (connectivity) | Added a `## Fixtures — M_X` section to the template |
| S5 | LOW | TEST_FIXTURES requires a Phase 6 fixture report; PHASE_6 listed 14 sections, none of them fixtures (linkage) | Added section 15, Fixture Report |
| S6 | LOW | ROOT_CAUSE_GROUPING mandates Phase 6 report distinct-bug count vs test count; PHASE_6 STATUS Distribution never mentioned root-cause aggregation (linkage) | STATUS Distribution now requires the RC aggregation line |
| S8 | MEDIUM | A02 Rule 6 backfills the UX register "in Phase 4," but AGENT_PROTOCOL froze registers post-gate "(only A02 writes)" with no stated mechanism — the write path existed but wasn't bridged to the HANDOFF system (bridging) | AGENT_PROTOCOL §1 now spells out A02's two post-gate write cases; A02 Rule 6 routes the backfill via an `A02 → All` HANDOFF |
| ATTR | — | No copyright or attribution anywhere in the kit | MIT `LICENSE` + `NOTICE` added; inline copyright banner stamped into all 68 markdown files; SKILL.md frontmatter carries `license` + `copyright` fields naming https://github.com/Harery and https://github.com/Harery/Praetor |

Simulation also **confirmed clean**: chunking markers (`continue` vs
`continue module`) are consistent between PHASE_4 and CHUNKING_PROTOCOL (flow,
sequencing); tier assignments match between SKILL.md, the roster, and the
activation matrix (uniformity); every v2.6 fix held (no regressions).

## v2.6 — Enterprise Consistency Audit (2026-06-09)

Full-kit audit against 20 governance dimensions (coherence, harmony,
uniformity, alignment, stability, robustness, integrity, reliability,
precision, fidelity, connectivity, flow, continuity, traceability,
progression, cohesion, bridging, sequencing, linkage, transitioning).
15 findings; all fixed. No behavioral semantics changed — only consistency,
traceability, and closure of one governance bypass.

| ID | Sev | Finding | Fix |
|---|---|---|---|
| F-01 | CRITICAL | 31 references pointed at a defunct numbered directory layout (`07-agents/`, `08-protocols/`, …), 4 with defunct filenames — progressive disclosure broke when the Orchestrator followed them | All paths rewritten to the real `references/<dir>/` layout |
| F-02 | CRITICAL | ARTIFACT_STATUS.md claimed to be the canonical tag registry, but 9 statuses used by charters/protocols were absent (e.g., `BLOCKED_PENDING_RUNBOOK`, `MANUAL_VERIFICATION_REQUIRED`, `BLOCKED_BY_MISSING_SCHEMA`) — the kit violated its own U4 | Missing extended statuses registered; a new **Modifier flags** section defines `LONG_RUNNING_TEST`, `REQUIRES_TIER_2`, `OWNER_REQUIRED`, `SNAPSHOT_DRIFT`, `PRIORITY_REBALANCE_NOTE` |
| F-03 | HIGH | Off-by-one agent count: "you command 18 agents" while A01–A17 = 17; GLOSSARY called A01–A17 "the 18 specialist agents" | Canonicalized per BY_THE_NUMBERS: **18 personas = A00 + 17 specialists**; SKILL.md, A00 charter, roster title, UAD, GLOSSARY all corrected |
| F-04 | HIGH | TEAM_ASSIGNMENTS + TIMELINE_ESTIMATES used the v1 phase model ("Phase 5 = Wrap-Up", 11 occurrences); RUN_MODES default omitted Phase 6 entirely, making the U6-mandatory wrap-up out-of-scope by default | All renumbered to the 7-phase model; `RUN_PHASES` default now `[0,1,2,3,4,5,6]` |
| F-05 | HIGH | Two conflicting Agent Activation Matrices (roster said A09 always; Phase 4 prose and A09's own charter said conditional; CAT-C rows disagreed on A06) | Roster declared the single source of truth with A09 conditionality footnoted; Phase 4 copy aligned and marked as deferring to the roster |
| F-06 | HIGH | 12 of 20 ENG test types (A.2, A.3, A.4, A.7, A.9, A.10, A.12, A.15–A.17, A.19, A.20) had no owning agent; A05's charter claimed types the roster didn't grant it | Canonical **Test-Type Ownership Map** added to CAT_A; roster `Outputs` and A05 charter aligned to it |
| F-07 | MEDIUM | Three contradictory CI pipeline definitions; the mandatory `secret-lint` stage was missing from two of them; artifact `A.14b` undefined in CAT_A | CAT_A pipeline declared canonical (now includes secret-lint + full-history secret-scan); MANDATE_engineering defers to it; `A.14b` row added |
| F-08 | MEDIUM | CHEATSHEET quick-start told users to paste a non-existent `MASTER_PROMPT.md`; BY_THE_NUMBERS pointed at a non-existent `tools/check_consistency.sh` | Quick-start rewritten for skill-based invocation; file count stated directly (68) |
| F-09 | MEDIUM | TEST_FIXTURES.md opened mid-sentence (truncated problem statement); PHASE_0 ended on an empty `## v2 Note` heading | Both completed |
| F-10 | MEDIUM | "Coordinator" (a human role) used as the internal run actor in PHASE_0, FAILURE_RULES, QUALITY_GATES | Internal actor is the Orchestrator (A00); gates clarify user-reply pass criteria vs. team-setting reviewers |
| F-11 | MEDIUM | **Governance bypass**: Judge 4 (Skip-Validity) triggers only on `NO_WORK_FOUND`, but A08 emitted `NOT_APPLICABLE`, A14 emitted `NO_TRIAGE_SURFACE_FOUND`, A09 said "SKIP", FAILURE_RULES said "Not applicable" — all skips that would silently escape review | Skip vocabulary closed: `NO_WORK_FOUND` is the only valid skip status; flavor goes in the rationale. All four call sites corrected |
| F-12 | LOW | All 5 artifact templates lacked the `STATUS` and `AGENT` fields mandated by SKILL.md Output Discipline | Fields added to every template |
| F-13 | LOW | PRIORITY_RUBRIC carried v1 thresholds (20/40/40, "P2 < 20%") alongside the v2 bands (15-30/30-50/30-50) | v1 numbers harmonized to the v2 bands |
| F-14 | LOW | "Solves v1 Gap #N" annotations reference an unshipped v1 gap list | Left in place (harmless historical context); recommendation: convert to self-contained statements in v3 |
| F-15 | LOW | A06 listed an inbound handoff as outbound (secrets direction inverted); RUN_MODES didn't cross-link the Resumable Snapshot it motivates | Direction corrected; cross-link added |

### Open recommendations (not blocking)

1. **Ship a real consistency check.** Re-introduce `tools/check_consistency.sh`
   (path-existence + tag-registry + count assertions) and run it before any
   version bump; F-01/F-02/F-08 were all script-catchable.
2. **De-duplicate convenience copies.** The activation matrix, status subset,
   and CI pipeline now each have a declared canonical home — prefer linking
   over copying in future edits.
3. **v1-gap annotations** (F-14): rewrite as self-contained rationale.
4. **A02 Rule 6 backfill loop**: the UX-register backfill instruction triggers
   "in Phase 4" but registers freeze after the Phase 3 gate (only A02 writes
   post-gate via the A02→All handoff). Works as designed via HANDOFF, but
   worth an explicit cross-reference in a future pass.
