# Quick Start Guide

Get Praetor running on your codebase in under 2 minutes.

## Prerequisites

- Access to a long-context LLM (Claude, GPT-5, Gemini, or similar)
- Your source code — as a public GitHub URL, uploaded files, or attached context

## Option A: Install Into Your Agentic LLM (Recommended)

```bash
npx praetor-audit-kit --install
```

This auto-detects and installs Praetor into all supported agentic tools on your machine (Claude Code, OpenCode, Cursor, and more). Then simply tell your LLM:

```
audit my codebase for production readiness
```

To install into a specific tool only:

```bash
npx praetor-audit-kit --install "OpenCode"
```

## Option B: Run Standalone via npm

```bash
npx praetor-audit-kit
```

Launches the interactive scope selector. Pick a scope, review the agents and areas covered, then point it at your codebase.

**Other CLI commands:**

```bash
npx praetor-audit-kit --scope biz          # show Business scope details
npx praetor-audit-kit --scope 2-4          # show range of scopes
npx praetor-audit-kit --check              # pre-flight checks
npx praetor-audit-kit --update             # update to latest from npm
npx praetor-audit-kit --uninstall          # remove from all tools
```

## Option C: GitHub Release

1. Go to [Releases](https://github.com/Harery/Praetor/releases/tag/v2.9.2)
2. Download `praetor-prompt-kit-v2.9.2.zip`
3. Extract and run `npx praetor-audit-kit --install` from the extracted directory

## After the Discovery Report

Once Phases 0–2 complete (~30 seconds), Praetor stops with a **MUST CONFIRM** block. Reply:

```markdown
continue with:
  Q1 = "<your tech stack>"
  Q2 = "<compliance requirements>"
override:
  RUN_PRIORITIES = [P0, P1]
then continue
```

For your first run, narrow scope with `RUN_MODULES = [single-module]` and `RUN_PRIORITIES = [P0]` to see how Praetor works before running the full audit.

## Next Steps

- **[[Why Praetor?|Why-Praetor]]** — Understand the architecture
- **[[The 18 Expert Agents|The-18-Expert-Agents]]** — Meet the specialists
- **[[Priority Rubrics & Overrides|Priority-Rubrics-and-Overrides]]** — Customize your run
- **[[The 7 Execution Phases|The-7-Execution-Phases]]** — Full pipeline walkthrough
