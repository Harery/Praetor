<!-- Praetor — Production Readiness Audit Skill
     Copyright (c) 2026 Mohamed Elharery (https://github.com/Harery). All rights reserved.
     Project repository: https://github.com/Harery/Praetor
     Licensed under the MIT License; see LICENSE at the repository root. -->

# By the Numbers

> These counts are the single source of truth. Every other file matches them
> or links here.

| Aspect | Count |
|---|---|
| Phases | 7 |
| Audience categories | 5 |
| Register types | 12 |
| Agent personas | 18 (A00 Orchestrator + A01–A17) |
| Quality Council judges | **4** (Coverage / Correctness / Clarity / Skip-Validity) |
| Inter-agent protocols | 13 |
| Artifact STATUS values | 7 core + extended set (see `references/protocols/ARTIFACT_STATUS.md`) |
| ID schemes | 11 (see `references/reference/ID_SCHEMES.md`) |
| Total files | 81 (71 markdown: SKILL.md + 67 reference files + CHANGELOG.md + tests/sim/README.md + tests/sim/flawed-app/README.md; + LICENSE + NOTICE; + 2 harness scripts `tools/check_consistency.sh`, `tests/sim/check_secrets.sh`; + 6 non-markdown fixture files under `tests/sim/flawed-app/` — package.json, migrations/001_init.sql, src/auth/login.js, src/auth/token.js, src/billing/refund.js, src/config/secrets.js) |

> The count covers kit files only. Runtime directories created by tooling or
> audit sessions (`.git/`, `.archive/`, `.remember/`, `.claude/`,
> `.sisyphus/`) are excluded — `tools/check_consistency.sh` stage 9 asserts
> this count against disk with the same exclusions.

## Canonical facts (copy verbatim where referenced)

- **Quality Council = 4 judges.** Judges 1–3 review every artifact. Judge 4
  (Skip-Validity) reviews only `NO_WORK_FOUND` artifacts. Gate 2 passes when
  all *applicable* judges assent.
- **Agents are sequentially-simulated personas.** Praetor is a single model
  adopting many expert voices in one context, not literally parallel
  processes. Use "dispatched as distinct personas" in user-facing copy.
- **Citations are re-derived at emit, not externally certified.** See
  `references/protocols/CITATIONS.md`. The Citations Index is a reviewed draft for
  human spot-check.
