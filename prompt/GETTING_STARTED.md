# Getting Started — A First-Time, Step-by-Step Guide

This guide is for someone who has **never run Praetor** and wants to use it on
a real project. No prior experience assumed. If a term is unfamiliar, check
`99-reference/GLOSSARY.md`.

## What Praetor is, in one sentence

You give it a codebase; it acts as 18 expert reviewers and hands you back
test cases, runbooks, alerts, support guides, compliance evidence, and a
risk register — each tied to a specific file and line so you can trust it.

## What you need before you start

- Access to Claude (the assistant you are reading this in).
- Your source code, in one of these forms:
  - a public GitHub URL, or
  - files you can upload, or
  - code you can paste.
- 10–15 minutes for a first small run. Large repos take longer and run in
  pieces (you will be prompted to continue).

## The 7 steps

### Step 1 — Load the system
Open `00-orchestrator/MASTER_PROMPT.md`. Copy everything from the line of
`═══` characters onward. Paste it into a new conversation with Claude.

### Step 2 — Point it at your code
On the next line after the pasted prompt, add one line:

```
Source: https://github.com/yourname/yourrepo
```

(Or `Source: the files I just uploaded`, or paste the code below that line.)
Send the message.

### Step 3 — Let it look around (silent, ~1–2 min)
Praetor reads your repo, classifies files, maps your domain, and detects your
tools. You will not see much yet — this is intentional. It is working.

### Step 4 — Read the Discovery Report and the "MUST CONFIRM" block
Praetor stops and shows you what it found, including a short list of things it
**inferred but is not sure about** (the MUST CONFIRM block). This is the most
important moment for you: it is asking you to confirm assumptions before it
does the heavy work.

### Step 5 — Reply at the gate
Reply using one of these simple forms (full reference:
`08-protocols/CONDITIONAL_CONTINUE.md`):

- Accept everything and run the full audit:
  ```
  continue
  ```
- Answer some of its questions (leave the rest as "unknown"):
  ```
  continue with: Q1 = yes, Q2 = unknown, Q3 = we use Stripe
  ```
- Narrow the scope (recommended for your first run — start small):
  ```
  override: RUN_MODULES = [the most important module], RUN_PRIORITIES = [P0]
  then continue
  ```
- Stop for now and get a snapshot to resume later:
  ```
  halt
  ```

**Beginner tip:** for your very first run, narrow to one module and P0 only
(the critical items). You will see how it works without a giant wall of output.

### Step 6 — Receive results, module by module
Praetor emits results for one module at a time, grouped by audience:
Engineering, Business, Operations, Support, Compliance. After each module it
pauses. Reply:

```
continue
```

to get the next one. If a single module is large, it may pause mid-way and
ask you to reply `continue module`.

### Step 7 — Read the wrap-up
After the last module, Praetor automatically emits a cross-audience summary:
coverage by audience, a gap report, the consolidated risk register, and —
importantly — a Regression Prevention Plan that ties each serious fix to a
CI gate, an alert, and a runbook.

## How to read what comes out

Every item carries a **STATUS** tag. The ones you will see most:

- `READY` — use it as-is.
- `READY_EXPOSES_BUG` — the test is correct, and your current code will fail
  it. This is Praetor finding a real bug. Look here first.
- `INFERRED` — based on an assumption; confirm before relying on it.
- `BLOCKED_BY_MISSING_CODE` — it references code that is not in what you gave.
- `NO_WORK_FOUND` — nothing applicable in that scope (a second judge checked
  that this skip is honest).
- `QC_FAILED` — it did not pass internal review; the reason is shown.

Full list: `08-protocols/ARTIFACT_STATUS.md`.

## Before you use the output in production — read this

- **Citations are re-derived, not certified.** Praetor re-opens each cited
  `file:line` before emitting, but it is one model checking itself, not an
  external auditor. **Spot-check citations** before using them as compliance
  or audit evidence.
- **Praetor writes specifications; it does not run them.** It does not execute
  tests, deploy code, send messages, or file tickets. You and your CI do that.
- **Treat `INFERRED` items as questions, not facts.** Confirm them.
- **Run the secret scan.** The secret-key scan and secret-lint CI stage
  (`04-mandates/SECRET_SCAN_MANDATE.md`) catch committed secrets — wire it
  into CI so leaks are caught on every commit, not just once.

## Common first-timer questions

**It produced a huge amount of output — is that normal?**
Yes, on a full run. Narrow with `RUN_MODULES` and `RUN_PRIORITIES` (Step 5).

**How many files does it create?**
None on disk by itself — it emits artifacts into the conversation. How many
artifacts depends on your codebase (modules × audiences × priorities). A small
single-module P0 run might emit a few dozen; a full multi-module run, many
hundreds. See `99-reference/BY_THE_NUMBERS.md` for the system's own counts.

**Can I stop and resume tomorrow?**
Yes. Reply `halt`; Praetor gives you a snapshot. Next session, paste the master
prompt, your source, and that snapshot. See `08-protocols/RESUMABLE_STATE.md`.

**Where do I learn the jargon?**
`99-reference/GLOSSARY.md`. For quick command reference, `99-reference/CHEATSHEET.md`.

## A safe first run, copy-paste

```
[paste contents of 00-orchestrator/MASTER_PROMPT.md here]

Source: https://github.com/yourname/yourrepo
override: RUN_MODULES = [M_AUTH], RUN_PRIORITIES = [P0]
then continue
```

Replace the URL and module name with your own. That gives you a focused,
readable first result you can evaluate before running the full audit.
