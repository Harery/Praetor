<!-- Praetor — Production Readiness Audit Skill
     Copyright (c) 2026 Mohamed Elharery (https://github.com/Harery). All rights reserved.
     Project repository: https://github.com/Harery/Praetor
     Licensed under the MIT License; see LICENSE at the repository root. -->

# Run Modes — How to Invoke Partial or Targeted Runs

Praetor accepts a `RUN CONFIGURATION` block at the end of your message
(skill-based invocation — no separate prompt file to load). Default = FULL
(all phases × all categories × all priorities × all modules).

## Override Syntax

Append this block at the very end of your message, after your
source reference:

```
RUN CONFIGURATION
  RUN_PHASES      = [0,1,2,3,4,5,6]
  RUN_CATEGORIES  = [A,B,C,D,E]
  RUN_PRIORITIES  = [P0,P1,P2]
  RUN_MODULES     = [all]
```

Omit any line to use its default. Omit the whole block to run FULL.

**Binding rule — mandatory phases:** Phases 5 (Quality Council) and 6
(wrap-up) cannot be excluded once Phase 4 runs. Any `RUN_PHASES` that
includes 4 implicitly includes 5 and 6 (the Orchestrator says so and
proceeds). A `RUN_PHASES` ending at 3 or earlier is valid — a discovery-only
run generates no modules, so Phase 5/6 have nothing to review and U6 is
satisfied vacuously.

**Cross-category references on partial runs:** when `RUN_CATEGORIES` excludes
a category, artifacts that would link to its IDs (e.g., a BV matrix citing
TC-IDs when CAT-A is excluded) carry `DEFERRED_TO_<category>` in place of the
missing reference. The Coverage Ledger tracks these deferred links so a later
run of the excluded category resolves them instead of regenerating.

**Model-capacity guidance.** Praetor is model-agnostic; the run configuration
is the lever that fits a run to whatever model tier executes it. Three
provider-neutral tiers (every vendor has equivalents):

- **Big / reasoning tier** (large context, deep reasoning — e.g. a flagship
  reasoning model): handles a FULL run (all phases × categories × priorities)
  in the fewest sessions; chunk at the default ~6000-token threshold.
- **Standard tier** (mid context): prefer `RUN_PRIORITIES = [P0,P1]` or a few
  categories per session; expect more `continue`/`continue module` turns.
- **Fast / small-context tier** (a "turbo" or "mini" class — fast inference,
  smaller context): scope tightly — `RUN_PRIORITIES = [P0]`, single-category
  or single-module runs — chunk earlier (~4000 tokens, see
  `references/protocols/CHUNKING_PROTOCOL.md`), and lean on `halt` + Resumable
  Snapshot to span sessions.

The discipline is the same at every tier: narrow the *scope*, never abbreviate
agent *output* (U3 forbids "summarized for readability"). A smaller context
completes the same run in more, smaller pieces — it never emits less per piece.

---

## Pre-Built Run Recipes

### Recipe 1 — Discovery & Gate Only
> *"I want to see the registers and module inventory before committing to generation."*

```
RUN_PHASES = [0,1,2,3]
```

Output: Discovery Report only. The run ends at the gate.
Use this **the first time** you run the kit on any repo.

### Recipe 2 — P0 Readiness Floor (all audiences)
> *"Pre-launch readiness. What absolutely must be true?"*

```
RUN_PRIORITIES = [P0]
```

Output: Discovery Report + per-module P0 artifacts across all five audiences.
Smallest viable readiness baseline.

### Recipe 3 — Business Team Package
> *"Business team needs BR validations and UAT scripts. Engineering can come later."*

```
RUN_CATEGORIES = [B]
RUN_PRIORITIES = [P0,P1]
```

Output: business-only artifacts. About 30–60 person-hours total.

### Recipe 4 — Ops Team Hardening
> *"On-call is suffering. Give us runbooks and alerts."*

```
RUN_CATEGORIES = [C]
RUN_PRIORITIES = [P0,P1]
```

Output: runbooks, alerting matrix, SLO definitions, dashboards, DR drill.

### Recipe 5 — Under-Resourced Triage (BIZ + OPS + SUP, P0 only)
> *"Engineering is buried. Help the other three teams urgently."*

```
RUN_CATEGORIES = [B,C,D]
RUN_PRIORITIES = [P0]
```

The pattern explicitly built for under-resourced support / ops / business teams.

### Recipe 6 — Single Critical Module Deep Dive
> *"Payments is high-risk. Exhaustive coverage of just that module."*

```
RUN_MODULES = [M_PAYMENTS]
RUN_PRIORITIES = [P0,P1,P2]
```

All five categories, all priorities, one module. Useful for high-stakes areas
like auth, payments, or any compliance-critical surface.

### Recipe 7 — Compliance Audit Prep
> *"SOC2 audit in 3 weeks. What's the evidence position?"*

```
RUN_CATEGORIES = [E]
RUN_PRIORITIES = [P0,P1,P2]
```

Output: control mapping, audit evidence index, PII flow maps, risk register.

### Recipe 8 — Pre-Release Smoke Pass
> *"Quick verification before tagging the release."*

```
RUN_CATEGORIES = [A]
RUN_PRIORITIES = [P0]
```

Then filter the generated `[ENG]` tests to type = `smoke`. Use this output as
the release-gate checklist.

### Recipe 9 — Support Knowledge Base Refresh
> *"Top customer issues. Rebuild the help-desk content."*

```
RUN_CATEGORIES = [D]
RUN_PRIORITIES = [P0,P1]
```

Output: triage trees, known-issue log, error translations, comm templates, FAQs,
account-state cheat sheets.

### Recipe 10 — New Feature Drop Coverage
> *"We just shipped Module X. Cover only that module across all teams."*

```
RUN_MODULES = [M_NEW_FEATURE]
```

All categories, all priorities, one module.

---

## Choosing Priorities

| Priority | When to include | Trade-off |
|---|---|---|
| P0 only | Time pressure, pre-launch, compliance deadline, on-call emergency | Misses edge cases and polish |
| P0 + P1 | Standard release readiness | Recommended floor for production systems |
| P0 + P1 + P2 | Mature platform, audit prep, comprehensive baseline | Largest token + adoption cost |

## Choosing Categories

| Categories | Use Case |
|---|---|
| `[A]` alone | Internal engineering exercise, no business/ops involvement |
| `[A,B]` | Pre-UAT cycle |
| `[A,C]` | Pre-launch operational readiness |
| `[B,C,D]` | Under-resourced teams need help; engineering covered |
| `[E]` alone | Audit prep |
| All five | First-time full baseline (recommended) |

## Choosing Modules

| Pattern | Strategy |
|---|---|
| `[all]` | Full platform coverage |
| `[M_CRITICAL_1, M_CRITICAL_2, ...]` | Risk-prioritized list, P0 modules first |
| Single module | Deep-dive or new feature coverage |
| One per service | Smoke pass across microservices |

---

## Combining Recipes Across Sessions

The model's context resets between sessions. If you ran Recipe 1 (Discovery
only) in session 1 and want to run Recipe 2 (P0 readiness) in session 2, you
must **re-supply the source** (repo URL or files). Praetor will re-run
discovery silently but should land on the same module inventory if the repo
hasn't changed.

For very large repos, save the Discovery Report from Recipe 1 and provide it as
context in session 2 alongside the source, so Praetor can skip rediscovery.

Better still: reply `halt` (at the gate or at any module boundary) and
Praetor emits a **Resumable Snapshot** — a structured resumable block that
restores discovery, registers, gate answers, and the Coverage Ledger in one
shot. See `references/protocols/RESUMABLE_STATE.md`. Wall-clock planning for
each recipe lives in `references/execution/TIMELINE_ESTIMATES.md`.

---

## How to Signal Override Mode

The first line of your message should make the run mode explicit:

```
Mode: PARTIAL — RUN_CATEGORIES = [B,C,D], RUN_PRIORITIES = [P0]

Audit my code with Praetor.

Source: https://github.com/your-org/your-repo
```

Or for full runs, just:

```
Mode: FULL

Audit my code with Praetor.

Source: /mnt/user-data/uploads/your-repo.zip
```
