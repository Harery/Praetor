# By the Numbers

> These counts are the single source of truth. Every other file matches them
> or links here. The total file count is produced by the consistency script
> (`tools/check_consistency.sh`) rather than written by hand.

| Aspect | Count |
|---|---|
| Phases | 7 |
| Audience categories | 5 |
| Register types | 12 |
| Agent personas | 18 (A00 Orchestrator + A01–A17) |
| Quality Council judges | **4** (Coverage / Correctness / Clarity / Skip-Validity) |
| Inter-agent protocols | 13 |
| Artifact STATUS values | 7 core + extended set (see `08-protocols/ARTIFACT_STATUS.md`) |
| ID schemes | 11 (see `99-reference/ID_SCHEMES.md`) |
| Total files | run `tools/check_consistency.sh` |

## Canonical facts (copy verbatim where referenced)

- **Quality Council = 4 judges.** Judges 1–3 review every artifact. Judge 4
  (Skip-Validity) reviews only `NO_WORK_FOUND` artifacts. Gate 2 passes when
  all *applicable* judges assent.
- **Agents are sequentially-simulated personas.** Praetor is a single model
  adopting many expert voices in one context, not literally parallel
  processes. Use "dispatched as distinct personas" in user-facing copy.
- **Citations are re-derived at emit, not externally certified.** See
  `08-protocols/CITATIONS.md`. The Citations Index is a reviewed draft for
  human spot-check.
