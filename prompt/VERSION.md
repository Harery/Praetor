# Praetor Version

**Current: 2.8.0**

## What Praetor Contains

- 18 expert agent personas (A00 Orchestrator + A01–A17 specialists),
  dispatched sequentially-simulated within a single context
- 4-judge Quality Council (Coverage / Correctness / Clarity / Skip-Validity)
- 13 inter-agent protocols
- 7 phases
- 5 audience categories
- 12 register types
- Artifact status: 7 core values plus an extended set
  (single source of truth: `08-protocols/ARTIFACT_STATUS.md`)
- 11 ID schemes (single source of truth: `99-reference/ID_SCHEMES.md`)
- Test fixtures (seed SQL + teardown) for every data-dependent test
- Secret-key scan + secret-lint CI stage (A06)
- Resumable state: `halt` emits a paste-back snapshot
- Self-consistency CI guards under `tools/`
- Skill manifest (`SKILL.md`) for Claude Code loading
- First-time user guide (`GETTING_STARTED.md`)
- Total file count: run `tools/check_consistency.sh` (not hardcoded)

## Design Properties

- **Single-prompt gateway** — one paste serves QA, QC, Security, Operations,
  Support, and Compliance.
- **Autonomous expert agents** — each operates without supervision in its
  scope, with a declared persona, authority, and refusal conditions.
  Agents are sequentially-simulated personas within one context, not
  literally parallel processes; the discipline (separate scopes, handoffs,
  deduplication, independent review) is real.
- **Re-derived citations** — every `file:line` claim is re-opened before emit
  by Quality Council Judge 2. This is a single-model discipline, not external
  certification; treat the Citations Index as a reviewed draft requiring human
  spot-check before use as audit evidence.
- **Layer-aware coverage** — cross-layer scenarios preserved via `RELATED_TO`;
  same-layer duplicates deduplicated via `DUPLICATE_OF`.
- **Tooling-adaptive output** — detected CI/monitoring/help-desk tools drive
  format adaptation (detected by config / dependency / env-var name, never by
  reading secret values); generic format with adoption recommendations when
  nothing is detected.
- **Auto-balanced priorities** — the Domain Mapping Agent enforces a
  15-30 / 30-50 / 30-50 distribution; `UNCORRECTABLE_DISTRIBUTION` is declared
  honestly when small N or genuine skew applies.
- **Secret hygiene** — A06 emits a masked findings table and a runnable
  secret-lint CI stage.
- **Resumability** — `halt` produces a compact snapshot that a later session
  pastes back to continue without re-running discovery.
- **Universal Agent Discipline** — 6 rules (U1–U6) every agent obeys:
  no self-skip, citation discipline, no output abbreviation, status-tag
  discipline, Coverage Ledger awareness, mandatory Phase 6 wrap-up.
- **Self-consistency CI** — guards keep the kit's own headline facts aligned
  across files.
