# Contributing to Praetor

Thanks for helping improve Praetor — the multi-agent production readiness audit system.

## Quick Start for Contributors

1. **Fork** the repository
2. **Clone** your fork: `git clone https://github.com/YOUR_USERNAME/Praetor.git`
3. **Create a branch**: `git checkout -b fix/my-improvement`
4. **Make your changes** (keep scope tight)
5. **Run the consistency check**: `bash tools/check_consistency.sh`
6. **Commit and push**: `git commit -m "fix: description of change"`
7. **Open a Pull Request** against `main`

## What to Contribute

We welcome contributions from SREs, compliance officers, security auditors, prompt engineers, and anyone passionate about production readiness.

| Area | Examples |
|:---|:---|
| **Prompt content** | New agent behaviors, protocol improvements, mandate clarifications |
| **Consistency fixes** | Count corrections, cross-reference alignment, dead-link removal |
| **Security & compliance** | New control mappings, updated regulatory references, secret-scan patterns |
| **Documentation** | Wiki pages, README improvements, glossary expansions |
| **Tooling** | CI improvements, consistency checker enhancements, new test fixtures |
| **Templates** | New artifact templates, template field additions |

## Quality Rules

- **Preserve file-line traceability** — every finding must carry a `file:line` citation
- **Keep changes consistent** — if you change a count, update the canonical source and run the checker
- **Keep changes ASCII** unless the file already uses non-ASCII characters
- **One concern per PR** — avoid bundling unrelated changes
- **No speculative claims** — document what the system does, not what it might do

## Before You Start

- **Open an issue first** describing the change and why it helps
- **Keep scope tight** — focused PRs review faster
- **Check existing issues** to avoid duplicating work

## Checks

- Run `tools/check_consistency.sh` when you touch counts, structure, or cross-references
- If you cannot run it, note that in the PR description

## PR Template

Every PR should include:
- **What** — the change and which files
- **Why** — the problem it solves and who benefits
- **Behavioral changes** — anything that changes output format or agent behavior
- **Consistency check** — pass result or explanation

## Style Guide

- Short, direct language — no filler
- Imperative mood in prompts ("Emit the report", not "The report should be emitted")
- Standardized headers: agent files use `# Agent A0X — Role`, protocols use `# PROTOCOL_NAME`
- Markdown tables for structured data, prose for explanations

## Community Standards

- Be respectful and professional
- Focus on the work and its impact
- See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) for full expectations

## Questions?

Open a [GitHub Discussion](https://github.com/Harery/Praetor/discussions) for questions, ideas, or show-and-tell.
