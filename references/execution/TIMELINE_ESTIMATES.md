<!-- Praetor — Production Readiness Audit Skill
     Copyright (c) 2026 Mohamed Elharery (https://github.com/Harery). All rights reserved.
     Project repository: https://github.com/Harery/Praetor
     Licensed under the MIT License; see LICENSE at the repository root. -->

# Timeline Estimates

Concrete wall-clock timelines for the most common run patterns. All estimates
assume a typical mid-size SaaS platform (10–20 modules, ~100k LOC, 3 services).
Apply scaling multipliers from `TEAM_ASSIGNMENTS.md` for other sizes.

> **Estimation basis:** these are planning heuristics derived from the
> per-audience adoption rates in TEAM_ASSIGNMENTS.md, not measured benchmark
> runs. Model wall-clock varies by model tier and provider. Calibrate after
> your first run: record actuals per phase and scale the grids accordingly.

---

## Timeline 1 — P0-Only Readiness (Pre-Launch Crunch)

**Team**: 5 people (Coordinator + 1 per audience).
**Scope**: All categories, P0 only, all modules.
**Wall-clock**: ~4 business days.

```
Day 1 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Morning   Coordinator runs Phase 0–3 → Discovery Report
  Afternoon Cross-team review of Discovery Report + gate
            Sign-off by BA, Eng Reviewer, Compliance Officer

Day 2 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  All day   Phase 4 module generation (P0 only)
            Praetor produces ~5–8 modules
            Audiences start parallel adoption

Day 3 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  All day   Remaining modules generated
            Engineering automates highest-risk tests
            Ops wires P0 alerts
            Support loads triage trees + error translations

Day 4 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Morning   Phase 6 cross-audience wrap-up
  Afternoon Leadership review of traceability matrix
            P0 readiness sign-off
```

---

## Timeline 2 — Full Baseline (Quarterly Readiness Project)

**Team**: 11 people (Coordinator + 2 Eng + 1 QA + 2 BA + 2 SRE + 1 Support + 1 Compliance + 1 leadership reviewer).
**Scope**: All categories, all priorities, all modules.
**Wall-clock**: ~4 weeks.

```
Week 1 — Discovery & Gate
  Mon       Phase 0–3 run
  Tue       Discovery Report distributed to all teams
  Wed       Per-audience register validation (BA, Eng, Compliance)
  Thu       Gate review meeting; corrections fed back to Praetor
  Fri       Phase 3 re-run if needed; gate signed off

Week 2 — Module Generation (first half)
  Mon-Fri   Phase 4 modules 1–8 generated
            Engineering begins automation
            Each audience reviews per-module artifacts within 24h of generation

Week 3 — Module Generation (second half)
  Mon-Fri   Phase 4 modules 9–15 generated
            Adoption continues
            Mid-week: Coordinator checkpoint to track gap closure

Week 4 — Wrap-up & Adoption Push
  Mon       Phase 6 wrap-up emitted
  Tue       Per-audience review of gap report
  Wed       Leadership review of master traceability matrix
  Thu       Top-10 action plans (BIZ/OPS/SUP) approved
  Fri       Onboarding quick-starts distributed; CI integration scheduled
```

---

## Timeline 3 — Under-Resourced Triage (BIZ + OPS + SUP only)

**Team**: 4 people (Coordinator + 1 BA + 1 SRE + 1 Support).
**Scope**: CAT-B, C, D only. P0 only. All modules.
**Wall-clock**: ~2–3 weeks (the grid below shows the 2-week happy path;
INFERRED-heavy registers push toward 3 — same estimate as Scenario 4 in
`TEAM_ASSIGNMENTS.md`).

```
Week 1
  Mon       Phase 0–3 run, Discovery Report
  Tue       BA validates BR/WF/ROLE registers
            SRE validates DEP/SLO/ERR registers
            Support validates ERR/UX registers
  Wed       Gate signed off
  Thu-Fri   Phase 4 first half of modules generated
            BA runs UAT checklists in staging
            SRE installs P0 runbooks + alerts
            Support loads triage trees + error translations

Week 2
  Mon-Wed   Remaining modules generated
            Continued adoption
  Thu       Phase 6 wrap-up (BIZ/OPS/SUP only)
  Fri       Three teams sign off on their P0 readiness
            Engineering re-engaged with prioritized backlog of items requiring code changes
```

---

## Timeline 4 — Single-Module Deep Dive

**Team**: 5 people (Coordinator + 1 per audience).
**Scope**: One module (e.g., Payments). All categories, all priorities.
**Wall-clock**: ~3 business days.

```
Day 1
  Morning   Phase 0–3 with RUN_MODULES = [M_PAYMENTS]
  Afternoon Quick gate review (smaller scope = faster review)
            Phase 4 generation starts

Day 2
  All day   Adoption work
            Engineering automates all P0/P1 tests
            Ops wires runbooks for payment-provider failure modes
            Support builds payment-issue triage tree
            Compliance validates PCI control mapping

Day 3
  Morning   Phase 6 wrap-up for the module
  Afternoon Module sign-off; risk register entries filed
```

---

## Critical Path & Bottlenecks

The fastest path through any run pattern is:

```
Phase 0 (5min) → Phase 1+2 (silent, 5-20min) → Phase 3 review (3hrs cross-team)
                                                              ↓
                                                          GATE
                                                              ↓
              ┌─────────────────────────────────────────────────────────┐
              │  Phase 4 modules generated in sequence by Praetor        │
              │  (5-20 min each, fully autonomous)                      │
              │  Adoption happens IN PARALLEL across audiences          │
              └─────────────────────────────────────────────────────────┘
                                                              ↓
                                              Phase 6 wrap-up (4hrs + 1 day review)
```

**Bottleneck #1**: Engineering adoption of `[ENG]` tests (automating them).
This is always the longest-running parallel stream. If `[ENG]` is the
constraint, run a `[B,C,D]` triage first while engineering catches up.

**Bottleneck #2**: Phase 3 gate review. If registers aren't validated, every
downstream module inherits bad assumptions. Do not shortcut this step.

**Bottleneck #3**: Doc-poor repos. If Phase 2 produces mostly `INFERRED` items,
plan an extra 1–2 weeks for the business team to confirm or correct each
inferred rule before Phase 4 generation has authoritative anchors.

---

## Velocity Heuristics

- **Model wall-clock for one module's full generation**: 5–20 minutes.
- **Human adoption of one module's `[ENG]` artifacts**: 4–16 hours (1–2 engineers).
- **Human adoption of one module's `[BIZ]` artifacts**: 2–4 hours (1 BA).
- **Human adoption of one module's `[OPS]` artifacts**: 2–6 hours (1 SRE).
- **Human adoption of one module's `[SUP]` artifacts**: 1–3 hours (1 Support).
- **Human adoption of one module's `[COMP]` artifacts**: 1–2 hours (1 Compliance).

If wall-clock is critical, **parallelize across audiences**. A 5-person team
can complete one module's full adoption in a single business day. Sequential
adoption (engineering first, then everyone else) is 5x slower.

---

## Common Schedule Mistakes

1. **Booking Phase 4 the same day as Phase 3 gate.** The gate needs cross-team
   review time. Schedule at least 24 hours between gate and generation start.
2. **Assuming engineering will adopt everyone else's artifacts.** They won't.
   Distribute by audience or those artifacts die unread.
3. **Running full priorities in a 1-week sprint.** P0+P1+P2 across 15 modules
   is a multi-week project. A 1-week sprint = P0 only.
4. **Skipping Phase 6 wrap-up.** Teams need the master traceability matrix to
   know where their gaps are. Without it, the per-module work is invisible at
   leadership level.
5. **Running the kit once and never re-running.** Plan a quarterly re-run as
   the codebase evolves. The Discovery Report's INFERRED items get cheaper to
   resolve each time as docs improve.
