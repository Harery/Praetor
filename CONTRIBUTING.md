# Contributing to Praetor

Thanks for helping improve Praetor. This repo is a prompt kit with strict
self-consistency rules, so small, precise changes are best.

## What to contribute
- Prompt content, protocols, mandates, and templates
- Clarity fixes and consistency corrections
- Additional guidance for security, compliance, and release readiness

## Before you start
- Open an issue describing the change and why it helps.
- Keep scope tight. Avoid bundling unrelated changes.

## Quality rules
- Preserve file-line traceability language and consistency across docs.
- If you change counts, update the canonical sources and run the check.
- Keep changes ASCII unless the file already uses non-ASCII.

## Checks
- Run `tools/check_consistency.sh` when you touch counts or structure.
- If you cannot run it, note that in the PR.

## Submitting a PR
- Explain the problem, the change, and who benefits.
- List affected files.
- Call out any behavioral or format changes.

## Style
- Favor short, direct language.
- Avoid speculative claims unless the repo documents them.
