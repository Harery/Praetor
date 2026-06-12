# Quick Start Guide

Get Praetor running on your codebase in under 2 minutes.

## Prerequisites

- Access to a long-context LLM (Claude, GPT-5, Gemini, or similar)
- Your source code — as a public GitHub URL, uploaded files, or pasted code

## Option A: npm (Recommended)

```bash
npx praetor-audit-kit
```

This downloads the prompt kit and displays the quick start guide. Then:

1. Open the printed path to `MASTER_PROMPT.md`
2. Copy everything from the `═══` separator line onward
3. Paste into your LLM and append:
   ```
   Source: https://github.com/yourname/yourrepo
   ```
4. Send and reply `continue` when prompted

## Option B: GitHub Release

1. Go to [Releases](https://github.com/Harery/Praetor/releases/tag/v2.8)
2. Download `praetor-prompt-kit-v2.8.zip`
3. Extract and open `prompt/00-orchestrator/MASTER_PROMPT.md`
4. Copy from the `═══` line, paste into your LLM with your source URL
5. Reply `continue` when prompted

## Option C: Claude Code Skill

```bash
claude skill install Skill/praetor.skill
```

Then simply say: `audit my codebase for production readiness`

## Option D: Direct

1. Clone or download the repo
2. Open `prompt/00-orchestrator/MASTER_PROMPT.md`
3. Copy from the `═══` line, paste into your LLM with your source URL
4. Reply `continue` when prompted

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
