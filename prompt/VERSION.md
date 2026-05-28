# Praetor Version

**Current: 2.3** (operational quality release)

## What 2.3 Contains

- 18 autonomous agents (A00 Orchestrator + A01–A17 specialists)
- 4-judge Quality Council
- 12 inter-agent protocols
- 7 phases
- 5 audience categories
- 12 register types
- 7 artifact status values: `READY`, `READY_EXPOSES_BUG`, `INFERRED`,
  `BLOCKED_BY_MISSING_CODE`, `DUPLICATE_OF_<id>`, `RELATED_TO_<id>`,
  `DEFERRED_TO_<x>`
- Plain-language glossary for non-technical audiences
- Test fixture protocol (seed SQL + teardown for every test)
- Runbook reference verification (no broken doc paths)
- Effort estimates in dev-days (not org-dependent sprint counts)
- UX register backfill (cross-cutting UX rules captured)
- Regression Prevention Plan section in Phase 6

## Design Properties

- **Single-prompt gateway** — one paste serves QA, QC, Security, Operations,
  Support, and Compliance
- **Autonomous expert agents** — each operates without supervision in its
  scope, with declared persona, authority, refusal conditions
- **100% citation verification** — every file:line claim is re-opened and
  verified by Quality Council Judge 2
- **Layer-aware coverage** — cross-layer scenarios preserved via
  `RELATED_TO`; same-layer duplicates deduplicated via `DUPLICATE_OF`
- **Tooling-adaptive output** — detected CI/monitoring/help-desk tools
  drive format adaptation; generic format with adoption recommendations
  when nothing detected
- **Auto-balanced priorities** — Domain Mapping Agent enforces
  15-30/30-50/30-50 distribution; `UNCORRECTABLE_DISTRIBUTION` declared
  honestly when small N or genuine skew applies
- **Universal Agent Discipline** — 6 rules (U1-U6) every agent obeys:
  no self-skip, 100% citations, no output abbreviation, status tag
  discipline, Coverage Ledger awareness, mandatory Phase 6 wrap-up
