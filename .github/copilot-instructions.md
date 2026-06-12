# Praetor — Copilot Instructions

Welcome to **Praetor** (`@harery/praetor-audit-kit`), an autonomous production-readiness
and multi-agent audit system delivered as a **prompt kit**.

## What this project is

Praetor is NOT a traditional code library. It is a collection of carefully engineered
Markdown prompt files that orchestrate 18 expert AI agents plus a 4-judge quality
council. Users feed these prompts to LLMs (Claude, GPT, Gemini, etc.) to perform
security audits, compliance checks, test generation, and release-gate reviews.

## Repository layout

```
prompt/
  00-orchestrator/   # Master prompt & orchestration logic
  01-security/       # Security-focused agent prompts
  02-compliance/     # Compliance & regulatory prompts (SOC 2, GDPR, HIPAA)
  03-quality/        # Code quality & test generation prompts
  ...
bin/
  praetor.js         # CLI helper (welcome message, version info)
docs/ or wiki/       # Additional documentation
package.json         # npm package metadata (publishes prompt/ directory)
llms.txt             # Machine-readable index for LLM consumers
CHANGELOG.md         # Version history
LICENSE              # MIT
```

## Conventions

- All prompts are pure Markdown (`.md`). No runtime code in prompt files.
- Version bumps are reflected in `package.json` and tagged as `vX.Y.Z`.
- The `main` branch is the source of truth; feature work happens on branches.
- Commit messages follow conventional commits (`feat:`, `fix:`, `docs:`, `chore:`).

## How to contribute

1. Fork and create a feature branch from `main`.
2. Edit or add prompt files in `prompt/`. Keep language precise and unambiguous.
3. Run `markdownlint-cli2 "**/*.md"` locally to catch formatting issues.
4. Open a PR against `main`. The CI workflow will lint Markdown and check links.

## Useful files to read first

- `prompt/00-orchestrator/MASTER_PROMPT.md` — the entry point that wires all agents.
- `package.json` — version, description, and published file list.
- `CHANGELOG.md` — recent changes and release notes.
