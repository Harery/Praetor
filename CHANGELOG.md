<!-- Praetor — Production Readiness Audit Skill
     Copyright (c) 2026 Mohamed Elharery (https://github.com/Harery). All rights reserved.
     Project repository: https://github.com/Harery/Praetor
     Licensed under the MIT License; see LICENSE at the repository root. -->

# Praetor Changelog

> Recent entries only. The full v2.6 → v2.7.7 audit history lives in
> `references/reference/CHANGELOG_ARCHIVE.md` — split out in v2.8.0 so the
> working changelog stays small in any model's context window.

## v2.8.0 — Tri-Audit Consolidation: Three Independent Reports Adjudicated, All Valid Findings Fixed (2026-06-12)

Three independent BALA7-30 audits of v2.7.8 ran on the same day — two by one
auditor (a 37-finding first pass and a 15-finding fresh-eyes repeat) and one
by a second tool ("Ro2a", 67 findings including 1 claimed P0). Every finding
was adjudicated against the source before fixing: **~75 distinct valid
findings fixed** (overlap merged), **10 false positives documented** (below),
**a handful declined** with reasons. Both harnesses green after; minor
version bumped (2.7 → 2.8) because register schemas, snapshot format, and
checker behavior changed; embedded markers follow per the family policy.

### Adjudication — false positives (documented so they stay dead)

| Claim | Verdict |
|---|---|
| Ro2a F-001 (P0): secret-scan regex "broken" by `\|` escapes | **False.** The `\|` sequences are markdown table-cell escapes; the runnable patterns (harness + toml block) use real alternation and the live harness catches every planted secret. Real residual hazard — a voicer copying raw table text — defused with an explicit "copy from runnable sources" note in SECRET_SCAN_MANDATE |
| Ro2a F-031: A07's `INFERRED_BUDGET`/`BLOCKED_BY_MISSING_ENV` "not in ARTIFACT_STATUS" | **False.** Both declared (extended table, [ENG] A07 rows) |
| Ro2a F-042: SKILL lists Phase 5 as sequential | **False.** Execution Axes already marks it "inline per artifact" |
| Ro2a F-043: Audit Trail "missing" ASSUMPTION confidence | **False by design.** A01 never emits ASSUMPTION; explanatory note added to A01 + AUDIT_TRAIL |
| Ro2a F-056: file count "stale at 78, actual 79" | **False.** The 79th file was a `.sisyphus/` runtime artifact; exclusion now stated in BY_THE_NUMBERS and machine-asserted (checker stage 9) |
| Ro2a F-057: "20 test types but 21 rows" | **Already documented** (A.14b sub-type annotation, F-N in v2.7.5) |
| Ro2a F-061 / F-065: GLOSSARY QC/FX gaps | **False.** QC defined four lines below the cited line; FX formatted like its siblings |
| Ro2a F-023: ASSUMPTION "defined in no charter" | **Mostly false.** Defined in FAILURE_RULES §7, used by A05; the valid residue (A01 omission note) fixed |
| Audit-1 F-006 evaluation: "fixture only tests `\|\|` style" | **Understated the gap.** The fixture had NO JWT-fallback flaw at all; fixed properly (FLAW-9/FLAW-10 + harness class) |

Declined with reason: uniform "Anti-Patterns" sections across all charters
(section variance is acceptable, low value); a full detect-secrets config
(guidance line added instead — a second full config bloats context);
ERR→RB register column (sequencing-impossible: registers are built before
runbooks exist; direction documented instead).

### Headline fixes

| Theme | What changed | Findings closed |
|---|---|---|
| **Verification-layer honesty** | Checker v2.8: stage 3 now runs a real U4 usage scan (every status-like token used must be declared); new stages 8 (template mandatory fields), 9 (file-count assertion vs BY_THE_NUMBERS), 10 (multi-line vocabulary-residue sweep); stage 1 scans `.sh` citations too. Fixture gains FLAW-9/FLAW-10 (JWT `\|\|` and `??` fallbacks); secret harness asserts both. Three overstated CHANGELOG claims amended in place in the archive | Audit-3 F-101/F-102/F-110/F-115; Audit-1 F-002/F-006 |
| **Master-prompt residual** | The line-wrapped "after the master prompt + source" in RESUMABLE_STATE — survivor of the T-02 fix and four audits — rewritten for skill invocation; checker stage 10 prevents recurrence | Ro2a F-002; Audit-3 F-103 |
| **Register schemas** | Universal entry fields (source/confidence/priority/module) declared for all 12 registers; PRV expanded to 10 columns mapping 1:1 onto E.3 (storage, encryption, cross-border, logged); UX register now carries both events and commitments; BR source order aligned with A02 Rule 1; ERR→runbook direction documented; end-to-end Register Entry Lifecycle section; append-only numbering rule | Ro2a F-005–F-010, F-032/F-033; Audit-1 F-003/F-007/F-026/F-028/F-033 |
| **Run-control determinism** | CONDITIONAL_CONTINUE gains a deterministic parsing order, multi-line block delimiters, a tightened question heuristic, and a module-boundary/mid-chunk reply section; snapshot format upgraded (RUN_* names, mid-module STOPPED_AT, QC_FAILED_IDS, PENDING_HANDOFFS, manifest-hash fingerprint, tamper-awareness rule); RUN_MODES gains the binding mandatory-phase rule (4 ⇒ 5+6) and DEFERRED_TO_<category> for partial-run cross-references | Audit-1 F-005/F-012/F-018/F-019/F-027; Ro2a F-018/F-020/F-048/F-049; Audit-3 F-104/F-108 |
| **Handoff graph completed** | A08→A17 (matching the protocol's own worked example), A10→A02 escalation, A06→A16 for unanchored CRITICALs, A09→A05, inbound notes on A12/A13/A15/A16; BLOCK/ESCALATE message formats; "no open handoffs at module end" deadlock rule; A02→All routing exception stated where the routing rule lives | Ro2a F-003/F-012/F-025–F-030/F-046; Audit-1 F-011 |
| **Templates & categories** | Five mandatory artifact fields added to D.3/E.3/E.4 blocks; runbook gains the Open Items row A12 Rule 6 references (was ratified nowhere); CAT-B format blocks for B.3/B.5/B.6/B.7; `fixture` Type for A.20; A.9 retention-enforcement test note; PII-in-logs check in A06 Rule 4; A07 added to fixture-emitting agents | Audit-3 F-105/F-109/F-114; Audit-1 F-010/F-017; Ro2a F-017/F-013/F-014/F-015/F-038 |
| **Model-agnostic + agentic compliance** | Every "Claude" reference outside changelog history replaced with Praetor/the-model/agent-neutral phrasing (24 sites); model-capacity guidance in RUN_MODES (big-reasoning vs turbo/mini tiers: scope discipline, earlier chunking, snapshot-splitting — never output abbreviation); changelog history archived out of the working set; PHASE_4 activation-matrix convenience copy replaced with a pointer (drift class eliminated); U6 enumeration replaced with a pointer | Ro2a F-039/F-040/F-059/F-060/F-062/F-067; Audit-1 F-013/F-014/F-025/F-032 |
| **Coherence & counts** | Persona-count phrasing fixed in SKILL + A00 (18 = A00 + A01–A17; QC separate); PHASE_6 cadence reworded ("after every run"), Gate 3 surfaced in PHASE_6; QC single-rework rule made explicitly total-not-per-judge; QC_FAILED artifacts barred as DUPLICATE_OF targets; Coverage Ledger vocabulary note + semantic-matching rule; single-test and cross-module RC rules; Audit Trail canonicalized in AUDIT_TRAIL.md with truncation rule; A09 spawn condition covers P0+P1 runs; roster ‡/§ footnotes now cite CAT_C/CAT_E by path and CAT_C's note matches the roster's A07 scope | Audit-1 F-001/F-004/F-008/F-009/F-015/F-016/F-021/F-022/F-023/F-024/F-029/F-030/F-031/F-035/F-036/F-037; Ro2a F-004/F-011/F-016/F-021/F-022/F-024/F-034/F-035/F-037/F-044/F-045/F-047/F-051–F-053/F-055/F-063; Audit-3 F-106/F-107/F-111/F-112/F-113 |

### Design Rationale (carried questions, answered)

- **Priority bands 15-30 / 30-50 / 30-50:** chosen so an honestly-triaged
  mid-size SaaS register lands in-band without forcing, while "everything is
  P0" inflation trips the >10-point alarm. If everything is critical, nothing
  is — the band makes that lie visible instead of arguable.
- **QC rework capped at one cycle:** within a single context, a second rework
  rarely converges — it oscillates. Praetor's QC philosophy is tag-and-show,
  not silent-loop-until-clean; a visible QC_FAILED beats a hidden third draft.
- **A02 as sole post-gate register writer:** register stability is what makes
  cross-audience traceability auditable. One writer, two named amendment
  paths (gate corrections, A02→All handoff) — every change has one
  accountable route.
- **~6000-token chunk threshold:** large enough that a typical category table
  emits whole (the protocol forbids splitting tables), small enough to stay
  inside practical reply budgets; smaller-context tiers chunk at ~4000.
- **Effort in dev-days, not sprints:** sprint length varies 1–4 weeks by org;
  dev-days don't.

Verification: `tools/check_consistency.sh` (10 stages) → CONSISTENT;
`tests/sim/check_secrets.sh` (incl. both new JWT-fallback classes) → ALL
PLANTED SECRETS CAUGHT. File count 80, asserted by stage 9. Embedded markers
bumped to the v2.8 family (minor bump per the version-marker policy).


## v2.7.8 — Fourth Full-Kit Coherence Audit: Activation-Matrix Substance Parity + Fixture-Count Arithmetic (2026-06-12)

Fresh-sandbox audit of v2.7.7: all 78 files copied to a clean workspace and
read end-to-end; both harnesses executed live (green on first run; the F-A
permission-stripped-copy WARN fired as designed). Mechanical sweeps:
escaped-pipe-aware table column integrity (0 mismatches), dead-path scan
across every cited kit path (sole hit remains the documented illustrative
`tests/perf/login-p99.k6.js`), roster-vs-charter persona parity (17/17),
vocabulary-residue scan (`ROOT_CAUSE_ID`, `Blocked-by:`, skip aliases — all
clean outside CHANGELOG history). The run was governed by the twenty
declared quality dimensions (coherence, harmony, uniformity, alignment,
stability, robustness, integrity, reliability, precision, fidelity,
connectivity, flow, continuity, traceability, progression, cohesion,
bridging, sequencing, linkage, transitioning). Ten findings — 3 MED, 7 LOW —
all fixed and re-verified.

| ID | Sev | Finding | Fix |
|---|---|---|---|
| I-01 | MED | **Fixture-count arithmetic incoherent** — TEST_FIXTURES' Phase 6 addition defined "Unique fixture count: N − M" with N = total fixtures emitted and M = shared fixtures; but the protocol's own dedup rule means emitted fixtures are *already* unique, so N − M computes "fixtures used by exactly one test," not "the actual setup work required." PHASE_6 §15 repeated the muddled triple (precision, integrity) | Both files now report fixture *references* across tests (R), *distinct fixtures emitted* (N — explicitly the setup work, no subtraction), and fixtures shared by 2+ tests (M) |
| I-02 | MED | **Activation-matrix substance drift between canonical and copy** — the roster matrix (declared single source of truth) listed A06/A07 (CAT-C) and A06 (CAT-E) as unconditional Tier-2 spawns, while PHASE_4's convenience copy marks them conditional evidence-feeders; the charters and CAT_C/CAT_E ownership notes support the conditional reading, so the canonical source was the stale one (alignment, coherence) | Roster matrix gains footnotes ‡ (A06/A07 join CAT-C as evidence feeders for C.8/C.2/C.4/C.5 via handoff; A12/A13 remain emitting owners) and § (A06 joins CAT-E on A16 → A06 handoff); canonical and copy now agree in substance |
| I-03 | MED | **CHEATSHEET "18 Agents at a Glance" misstated roster membership** — listed A01–A17 + QC, omitting A00 and counting the Quality Council, while BY_THE_NUMBERS canonically defines 18 = A00 + A01–A17 with QC excluded (fidelity, uniformity) | Heading now "The Roster at a Glance (A00 + 17 specialists + Quality Council)" with an A00 line added at the top |
| I-04 | LOW | **Two residual charter-ownership gaps (G-13 class)** — A11's charter never claimed B.3 (Success Metrics & Acceptance Criteria) and A15's never claimed D.5 (module-scoped FAQ), though the roster and category files assign both (cohesion, linkage) | Both mandates gain the ownership sentence, deferring to the category files' canonical notes |
| I-05 | LOW | CAT_D and CAT_E lacked the agent-ownership note CAT_B and CAT_C gained in prior audits, leaving a reader to derive D/E generation ownership from the roster alone (uniformity, bridging) | Both category files gain the ownership note (A14: D.1–D.3, D.6–D.8; A15: D.4–D.5; A16: E.1–E.3; A17: E.4, with the A16 → A06 evidence handoff stated) |
| I-06 | LOW | **GLOSSARY user-facing gaps** — the Gate-replies entry (added in H-01) omitted `override:` and the question carve-out, both accepted at the gate; Document Type Terms covered 10 of the 11 ID schemes — FX (Test Fixture) missing despite the Phase 6 Fixture Report being read by non-technical audiences (bridging, connectivity) | Gate-replies entry now lists `override:` and explains the question carve-out; FX entry added after RC |
| I-07 | LOW | **MANDATE_engineering CI pipeline copy drifted from canonical CAT_A** (G-08 class) — nightly order swapped (`api → e2e` vs `e2e + api`), `chaos (P2)` and the `(full-history)` qualifier dropped (uniformity, linkage) | Copy aligned verbatim with CAT_A's canonical PR + nightly stages |
| I-08 | LOW | TIMELINE_ESTIMATES Timeline 3 said "~2 weeks" while TEAM_ASSIGNMENTS Scenario 4 (the same B/C/D, P0-only run) says "~2–3 weeks" (continuity, precision) | Timeline 3 now "~2–3 weeks," noting the grid shows the 2-week happy path and cross-linking the scenario |
| I-09 | LOW | **A01's example used an undeclared composite layer** — `SERVICE+DOMAIN` appears twice in the Audit Trail examples, but ID_SCHEMES declares 15 single tags only and Ledger dedup matches on single tags (precision, stability) | ID_SCHEMES now declares the `+` composite as legal *only* in A01's per-file Audit Trail classification; artifact Layer columns, Ledger entries, and TC ID slots always carry exactly one canonical tag |
| I-10 | LOW | SKILL Reference Map enumerated `references/reference/` by content but named 4 of its 5 files — FAILURE_RULES omitted (connectivity) | Line now includes "failure & ambiguity rules" |

Verification: `tools/check_consistency.sh` (7 stages) → CONSISTENT;
`tests/sim/check_secrets.sh` → ALL PLANTED SECRETS CAUGHT; full re-read of
every touched file plus a second pass of the dead-path, table-integrity, and
vocabulary sweeps → zero open findings. Embedded markers stayed `v2.7` per
the family-marker policy (patch bump only). File count unchanged at 78.

---

Older entries: `references/reference/CHANGELOG_ARCHIVE.md` (v2.6 → v2.7.7).
