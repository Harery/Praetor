<!-- Praetor — Production Readiness Audit Skill
     Copyright (c) 2026 Mohamed Elharery (https://github.com/Harery). All rights reserved.
     Project repository: https://github.com/Harery/Praetor
     Licensed under the MIT License; see LICENSE at the repository root. -->

# Praetor Changelog

> Recent entries only. The full v2.6 → v2.7.7 audit history lives in
> `references/reference/CHANGELOG_ARCHIVE.md` — split out in v2.8.0 so the
> working changelog stays small in any model's context window.

## v2.9.1 — Branding & Assets (2026-06-14)

**Packaging:**
- Added `assets/` directory to npm package (logo suite + social preview + favicon ship with the package)
- README badges: fixed stale label, added "13 Agentic Tools" and "4-Judge Quality Council" badges
- All 6 branding assets attached to GitHub release v2.9.0

**Wiki:**
- Home page: added logo, slogan, badge row, center-aligned branding header
- Quick Start: updated to 13-tool support, added --drill command, added interactive TUI reference

## v2.9.0 — Interactive TUI Rewrite: 13 Tools, Sub-scope Detail, Update Progress, Disclaimers (2026-06-14)

**Interactive TUI overhaul:**
- **13 agentic tool support**: Expanded from 3 to 13 — Claude Code, OpenCode, Cursor, Windsurf, GitHub Copilot, Cline, Amazon Q Developer, Gemini CLI, Aider, Continue.dev, Codex CLI, Roo Code, Sourcegraph Cody
- **Docker terminal fix**: Replaced raw-mode stdin with `readline` for Enter-to-return prompts — eliminates phantom `\r\n` key events that caused empty-screen bugs in Docker/Linux terminals. All screen writes are now atomic (single buffer flush)
- **Sub-scope detail screen**: Selecting a sub-scope now shows assigned agents (with descriptions parsed live from `prompt/07-agents/*.md`), areas covered, AI agent compatibility (all 13 tools listed), LLM disclaimer, and a 5-step installation guide with exact commands for the selected scope
- **Update progress screen**: Four-step progress (local version → npm registry → version comparison → skill file verification) with spinners. Already-latest path shows full installation inventory + "All dependencies and skill files are on the latest version. Nothing to update." Update-available path shows what will be updated + changelog highlights + download animation + post-update summary
- **Banner LLM disclaimer**: Main menu banner now explicitly states Praetor does NOT provide any LLM API key, subscription, or model access
- **Pre-flight attention banner**: Red ATTENTION box at end of `--check` clarifying Praetor does NOT install, provide, or help install any AI agentic tool — it only installs its audit skill INTO tools already present
- **Install fallback removal**: `--install` now refuses to install when zero tools are detected (was blindly writing to all 13)
- **Bin field dual mapping**: Both `praetor-audit-kit` and `praetor` resolve to `bin/praetor.js`
- **`--drill` CLI handler**: `npx praetor-audit-kit --drill eng 4` works from CLI without entering TUI

## v2.8.5 — 10 Production Hardening Fixes + Interactive Scope Selector (2026-06-13)

**P0 — Breakage fixes:**
- **scopes.json manifest**: Extracted all 52 sub-scopes to `prompt/scripts/scopes.json` — single source of truth for scope-select.js, SKILL.md, and bin/praetor.js
- **Agent-safe SKILL.md**: Plain-text scope list with numbered menu — no TUI dependency, agents present the list and ask the user to reply with a number/alias
- **`--scope` CLI flag**: `npx praetor-audit-kit --scope biz` or `--scope 2-4` for non-interactive scope selection in CI/CD pipelines

**P1 — Experience gaps:**
- **Sub-scope drill-down**: Press `d` in TUI to drill into a scope's sub-scopes, or use `--drill eng 3` for JSON output
- **`--uninstall` flag**: Removes Praetor from all installed agentic tools (Claude Code, OpenCode, Cursor)
- **Terminal height detection**: Detail pane auto-paginates on small terminals (< 24 lines)
- **Explicit agent mapping**: SKILL.md contains a full scope→agent→category table — agents cannot guess which agents to dispatch

**P2 — Scale:**
- **Version check**: `--check` now queries npm registry and warns if local is behind; `--update` flag for self-update
- **`--no-tui` flag**: Force numbered-list-only mode for Windows, CI, or non-interactive terminals
- **Scope aliases**: `--scope security`, `--scope biz`, `--scope eng` — everywhere (bin, scope-select.js, SKILL.md)

**Interactive TUI scope selector:**
- 8 main scopes, 52 sub-scopes
- Arrow key navigation with live detail pane (angled-line theme, colored sub-scopes)
- Number keys (1-8) for instant selection
- Space for multi-select, `d` for drill-down into sub-scopes
- Non-TTY fallback: returns JSON

## v2.8.4 — Packaging & Install Fix: --install Flag (2026-06-13)

- **Breaking banner change**: replaced `claude skill install` (non-existent CLI command) with `npx praetor-audit-kit --install` which copies the full skill tree to `~/.claude/skills/praetor/`
- Added `--install` / `-i` flag to bin script
- Updated all docs (README, prompt/README, wiki, VERSION, SKILL.md) to reflect new install command

## v2.8.3 — Packaging & Install Fixes (2026-06-13)

- Removed stale `Skill/praetor.skill` ZIP from repo and npm tarball
- Fixed banner box alignment (all lines now 66 chars)
- Added `references/` to npm `files[]` (25 broken references in root SKILL.md)
- Fixed `--prompt` separator detection (matched inline backtick instead of actual separator)
- Fixed `-l` short flag (`--l` double-dash → `-l` single-dash)
- Fixed `claude skill install` path pointing to `prompt/SKILL.md` (text markdown, not ZIP)
- Reconciled package name: `@harery/praetor-audit-kit` → `praetor-audit-kit` (unscoped)
- Removed `repository.directory: "prompt"` from package.json
- Removed `Skill/` directory from project tree in README
- Version bumped across package.json, banner, help text, SKILL.md, VERSION.md

## v2.8.2 — Dual-Audit Consolidation: Handoff Graph Made Canonical + Bidirectionality Resolved (2026-06-12)

Two independent BALA7-30 audits of v2.8.1 — "opencode" (38 findings: 0 P0,
4 P1, 20 P2, 12 P3, 2 P4; one P0 self-declined as a false positive) and
"Ro2a" (a delta on opencode adopting F-001–F-038 and adding F-101–F-141,
40 new). Both converged on one systemic theme: **handoff bidirectionality** —
agents declared outbound handoffs that receivers never acknowledged (~30 of
the ~78 findings). Every finding adjudicated against source before fixing:
**~70 distinct valid findings fixed**, **2 false positives confirmed**,
a few reframed. Both harnesses green; patch bump (no schema/contract change
beyond additive registry + checker stages), embedded markers stay v2.8.

### Adjudication — false positives (confirmed against source)

| Claim | Verdict |
|---|---|
| opencode F-012 (P0): BY_THE_NUMBERS file count off by 1 | **False — self-declined by the auditor.** The checker's stage-9 assertion is canonical; the count was correct. |
| Ro2a F-036: `INFERRED_FAILURE_MODE` "attributed only to A13" | **False.** ARTIFACT_STATUS attributes it to `[OPS] A12`, and A12's charter uses it — attribution is correct and complete. No change. |

Reframed rather than fixed-as-stated: the "one-sided handoff" findings
(opencode F-007/F-026; Ro2a F-102/F-103/F-108–F-135) were **not** fixed by
adding a redundant "Inbound" list to all 17 charters — that recreates the
convenience-copy drift the kit fights. Instead the fix is structural (below):
one canonical registry + a declaration convention. The intent (full
bidirectional traceability) is satisfied; the redundancy is avoided.

### Headline fixes

| Theme | What changed | Findings closed |
|---|---|---|
| **Canonical handoff registry** | HANDOFF_PROTOCOL.md now carries the *complete* directed-edge graph (~55 edges), not a "common subset": broadcast-edge semantics (Tier-1/A02 → All are ambient, no per-recipient ack), circular-pair initiation order (A06↔A12, A12↔A13, A07↔A13 each get a named first-mover). AGENT_PROTOCOL declares the convention: charters list **outbound** edges; the registry is the canonical bidirectional view; sink agents (A02/A05/A06/A07/A17) carry a short Inbound pointer. ROSTER's incomplete 4-row table replaced with a pointer. | opencode F-007/F-008/F-026/F-035; Ro2a F-102/F-103/F-104/F-106/F-107/F-108/F-109/F-110/F-111/F-112/F-113/F-114/F-116–F-135 |
| **A00 ↔ A02 protocol coherence** | A00's refusal condition now exempts A02's `UNCORRECTABLE_DISTRIBUTION` emission (its legitimate protocol exit); the rubric states the exit is human-confirmed at the gate, reconciling the 30% cap with the escape hatch. Coverage Ledger "(write)" misattribution corrected in SKILL + A00 (Orchestrator maintains it; agents read). | Ro2a F-101/F-105; opencode F-011/F-015 |
| **Precision & determinism** | Priority bands stated as independent windows summing to 100% (not additive); `BLOCKED` umbrella replaced with "the specific `BLOCKED_BY_*` status"; gate Format 3 routes register writes to A02 only (A01 re-runs discovery); question-detection interrogative list expanded + reframed non-exhaustive; SNAPSHOT mixed-environment normalization rule (SHA-256 optional, ignored when one-sided); snapshot gains `AGENTS_NOT_ACTIVATED`; QC `QC_FAILED` reasons enumerated as a closed set; "currently 15 sections" → authoritative pointer. | opencode F-001/F-002/F-004/F-013/F-014/F-025/F-034; Ro2a F-121/F-122/F-123/F-130 |
| **Risk-register consolidation** | PHASE_6 §13 states the master view absorbs B.5 + E.4, dedups via RELATED_TO. Compliance mandate ownership line precise: A17 generates, compliance adopts. | opencode F-005/F-023 |
| **Glossary + model tiers** | Added HANDOFF, MRR, Sev1/Sev2, SNAPSHOT_TOKEN, SNAPSHOT_DRIFT. RUN_MODES "turbo/mini" replaced with a provider-neutral three-tier model-capacity section (big/reasoning, standard, fast/small-context) — scope discipline, never output abbreviation, at every tier. | opencode F-010/F-029/F-033 |
| **Templates & mandates** | Support-playbook SLA claim bound to an SLO placeholder; escalations name roles (Platform Engineering, Billing Operations) with RB-IDs; TC-ID template label `LAYER` → `TAG` (Layer or Discipline); A13 burn-rate thresholds marked defaults; MANDATE_engineering CI copy disclaimer; runbook Open Items mandatory-when-unverified; gitleaks allowlist warns against allowlisting the self-test fixture; SKILL privacy/data-handling note; A10 cites its B.NNN IDs; velocity heuristics cross-referenced to canonical grid; license "All rights reserved" removed (MIT contradiction). | opencode F-009/F-016/F-017/F-018/F-020/F-021/F-022/F-024/F-027/F-028/F-030/F-031/F-032/F-037; Ro2a F-115/F-140 |
| **Harness hardening** | Checker stage 1 scans tests/ + tools/ paths (not just references/); stage 8 matches fields only in table rows/labels (not prose); stage 9 uses a shared runtime-exclusion list; stage 6 prints harness output on failure; new stage 11 asserts CI-pipeline copy parity across the 3 files. Fixture gains FLAW-11/12/13 (AWS key, postgres-creds URL, RSA private key) so 3 previously probe-only classes have live positive coverage; negative control hardened to WARN-on-degrade. | opencode F-038; Ro2a F-120/F-136/F-137/F-138/F-139/F-141 |

Verification: `tools/check_consistency.sh` (11 stages) → CONSISTENT;
`tests/sim/check_secrets.sh` (13 planted flaws across 8 pattern classes) →
ALL PLANTED SECRETS CAUGHT. File count 81, asserted by stage 9. Patch bump;
embedded markers stay v2.8.


## v2.8.1 — Fifth Full-Kit Coherence Audit: PRV↔E.3 Column Parity Restored (2026-06-12)

Fresh-sandbox audit of v2.8.0: all 80 files copied to a clean workspace and
read end-to-end; both harnesses executed live (green on first run; the F-A
permission-stripped-copy WARN fired as designed). Mechanical sweeps:
escaped-pipe-aware table column integrity (0 mismatches), dead-path scan
across every cited kit path (sole hit remains the documented illustrative
`tests/perf/login-p99.k6.js`), model-name residue scan (clean),
roster-vs-ownership-map parity (17/17), archive-range cross-check, and
placeholder-discipline sweep. The run was governed by the twenty declared
quality dimensions (coherence, harmony, uniformity, alignment, stability,
robustness, integrity, reliability, precision, fidelity, connectivity, flow,
continuity, traceability, progression, cohesion, bridging, sequencing,
linkage, transitioning). Five findings — 1 MED, 4 LOW — all fixed and
re-verified.

| ID | Sev | Finding | Fix |
|---|---|---|---|
| P-01 | MED | **PRV↔E.3 derivation chain broken three ways** — REGISTERS §2.11, A16 Rule 3, and the v2.8.0 changelog all declare the PRV register's 10 columns map 1:1, column-for-column, onto E.3, but both E.3 formats (CAT_E + TEMPLATE_compliance_control) carried 8 columns (`Cross-Border`, `Logged` missing); A16 Rule 3's own bullet list additionally claimed "Source of collection" and "Processing operations" as PRV columns, neither of which exists in the schema (alignment, fidelity, traceability, linkage) | Both E.3 formats extended to the full 10 columns (template example rows populated, including a `Logged=Y` row exercising the A06 redaction-check path); CAT_E's E.3 artifact descriptor extended; A16 Rule 3 bullets realigned to the register's actual columns |
| P-02 | LOW | D.4 comm-template example in TEMPLATE_support_playbook used `[Customer Name]`, violating A15 Rule 3's named-placeholder discipline (`{customer_name}` style) that governs the same artifact class (uniformity, harmony) | Placeholder corrected to `{customer_name}` |
| P-03 | LOW | SKILL Reference Map claimed the archive holds "v2.6 → v2.7.8"; the archive title and CHANGELOG both say v2.6 → v2.7.7 — v2.7.8 lives in the working CHANGELOG (precision, continuity) | SKILL line corrected to v2.7.7 |
| P-04 | LOW | `tests/sim/check_secrets.sh` header still read "(v2.7.4)" although the script gained v2.8 changes (the separate `??` nullish-coalescing assertion); the sibling checker header reads (v2.8) (uniformity, fidelity) | Header bumped to the v2.8 family with an explicit provenance note (introduced v2.7.4, extended v2.8) |
| P-05 | LOW | REGISTERS' universal entry fields declare the field `priority`, while the BR and DEP schemas in the same file label it `criticality` with no declared bridge — two names for one field (precision, bridging) | Universal-fields note now states the label variance explicitly: same field, same rubric, same band enforcement |

Verification: `tools/check_consistency.sh` (10 stages) → CONSISTENT;
`tests/sim/check_secrets.sh` → ALL PLANTED SECRETS CAUGHT; full re-read of
every touched file plus a second pass of the table-integrity, dead-path, and
placeholder sweeps → zero open findings. Embedded markers stay `v2.8` per
the family-marker policy (patch bump only). File count unchanged at 80.


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
