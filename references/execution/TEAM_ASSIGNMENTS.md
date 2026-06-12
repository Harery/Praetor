<!-- Praetor — Production Readiness Audit Skill
     Copyright (c) 2026 Mohamed Elharery (https://github.com/Harery). All rights reserved.
     Project repository: https://github.com/Harery/Praetor
     Licensed under the MIT License; see LICENSE at the repository root. -->

# Team Assignments, Headcount & Time Estimates

This file answers: **Who runs each part? How many people? How long does it take?**

The kit assumes a **typical mid-size SaaS platform** with ~10–20 modules,
~3 services, ~100k LOC. Adjust proportionally for larger/smaller scope (see
"Scaling Rules" at the bottom).

---

## Roles Defined

| Role | Headcount | Required Skills |
|---|---|---|
| **Coordinator / Program Owner** | 1 | Runs the Praetor skill, distributes artifacts, tracks gaps. Can be the QA lead, engineering manager, or technical PM. |
| **Engineering Reviewer** | 1–3 | Validates `[ENG]` artifacts, executes generated tests, reports back gaps. Senior engineer per major service. |
| **QA Engineer** | 1–2 | Converts `[ENG]` artifacts into automated suite, owns regression set. |
| **Business Analyst / PM** | 1–2 | Validates `[BIZ]` registers (BR, WF, ROLE), runs UAT scripts, approves business rule semantics. |
| **Operations / SRE** | 1–2 | Adopts `[OPS]` runbooks, wires alerts, runs DR drills. |
| **Support Lead** | 1 | Adopts `[SUP]` artifacts into the help-desk knowledge base, trains tier-1 agents. |
| **Compliance / Security Officer** | 1 | Validates `[COMP]` control mappings, files audit evidence, signs off on risk register. |

**Minimum viable team: 5 people** (Coordinator + 1 per audience).
**Recommended full team: 11–15 people** across audiences.
**Bare-bones P0-only run: 3 people** (Coordinator + 1 engineer + 1 business
contact who also covers ops/support sign-off temporarily).

---

## Phase-by-Phase Assignment

### Phase 0 — Source Resolution
| Owner | Headcount | Effort | Wall-clock |
|---|---|---|---|
| Coordinator | 1 | 5 min | 5 min |

Coordinator provides Praetor with the GitHub URL or local repo path. No team
involvement.

### Phase 1 — Technical Discovery
| Owner | Headcount | Effort | Wall-clock |
|---|---|---|---|
| Praetor (autonomous) | — | — | 2–10 min depending on repo size |
| Coordinator (monitoring) | 1 | passive | — |

Silent phase. No human work.

### Phase 2 — Domain Mapping & Tooling Discovery
| Owner | Headcount | Effort | Wall-clock |
|---|---|---|---|
| Praetor (autonomous) | — | — | 3–15 min |
| Coordinator (monitoring) | 1 | passive | — |

Silent phase. No human work, but quality depends on what docs exist in the
repo. **If the repo is doc-poor, Phase 2 outputs will be heavily `INFERRED`
and Phase 3 will surface this as an Open Question.** A03 also detects org
tooling (CI, monitoring, help-desk) here; its Tooling Profile in the Phase 3
report drives the format of every [OPS]/[SUP] artifact downstream.

### Phase 3 — Discovery Report Review + Gate
| Owner | Headcount | Effort | Wall-clock |
|---|---|---|---|
| Coordinator | 1 | 30 min | 30 min |
| Business Analyst (validates registers 2.1, 2.2, 2.3) | 1 | 1 hr | same day |
| Engineering Reviewer (validates Module Inventory + layer detection) | 1 | 1 hr | same day |
| Compliance Officer (validates 2.6, 2.11) | 1 | 30 min | same day |

**Critical checkpoint.** Do not let the run proceed to Phase 4 until at least
the BA and Engineering Reviewer have signed off on the registers and inventory.
Errors here propagate into every module downstream.

**Gate decision:** Coordinator types `continue` (or provides corrections) in
the Praetor session. ~3–4 hours total cross-team effort, can finish in one half-day.

### Phase 4 — Per-Module Generation Loop
This is where the heavy work happens. **Praetor produces, humans validate and adopt.**

For each module, the generation is autonomous (5–20 min of model wall-clock).
The human work is **post-generation adoption**.

| Audience | Per-module human effort | Headcount |
|---|---|---|
| `[ENG]` adoption (convert to automated tests, run, fix gaps) | 4–16 hours | 1–2 engineers |
| `[BIZ]` adoption (review BR matrix, run UAT, sign off) | 2–4 hours | 1 BA |
| `[OPS]` adoption (wire alerts, install runbooks, schedule DR) | 2–6 hours | 1 SRE |
| `[SUP]` adoption (load into help-desk KB, train agents) | 1–3 hours | 1 Support Lead |
| `[COMP]` adoption (file evidence, update risk register) | 1–2 hours | 1 Compliance Officer |

**Per-module total wall-clock**: 1–3 business days if all five audiences work
in parallel. Most expensive audience is `[ENG]` (test automation).

> **Phase 5 (Quality Council)** has no separate human step here — it runs
> inline with Phase 4, per artifact, before anything is emitted. That is why
> the workflow jumps from Phase 4 to Phase 6.

### Phase 6 — Cross-Audience Wrap-Up
| Owner | Headcount | Effort | Wall-clock |
|---|---|---|---|
| Coordinator (synthesize wrap-up, schedule team reviews) | 1 | 4 hr | 1 day |
| Each audience lead (review gap report for their stream) | 5 | 1 hr each | 1 day |
| Leadership review of Master Traceability Matrix | 2–3 | 1 hr | 1 day |

**Wall-clock**: 2 business days from final module completion to leadership sign-off.

---

## Total Effort by Scenario

### Scenario 1 — P0-Only Readiness Run (smallest viable scope)
For: "We need to ship; what's the minimum we can't ignore?"

| Activity | Hours |
|---|---|
| Phase 0–3 (setup + gate) | 4 |
| Phase 4 × 10 modules × P0 only | 80–160 (parallel across audiences) |
| Phase 6 wrap-up | 12 |
| **Total cross-team effort** | **~100–180 person-hours** |
| **Wall-clock with 5-person team** | **~3–5 business days** |

### Scenario 2 — Full Run (recommended)
For: "We want a complete readiness baseline."

| Activity | Hours |
|---|---|
| Phase 0–3 | 4 |
| Phase 4 × 15 modules × P0+P1+P2 | 300–600 |
| Phase 6 wrap-up | 16 |
| **Total cross-team effort** | **~320–620 person-hours** |
| **Wall-clock with 11-person team** | **~3–4 weeks** |

### Scenario 3 — Single Audience Pull (one team at a time)
For: "Support team needs playbooks; everyone else later."

| Activity | Hours |
|---|---|
| Phase 0–3 | 4 |
| Phase 4 × 15 modules × CAT-D only × P0+P1 | 30–60 |
| Phase 6 wrap-up for `[SUP]` only | 4 |
| **Total cross-team effort** | **~40–70 person-hours** |
| **Wall-clock with 2 people (Coordinator + Support Lead)** | **~1–2 weeks** |

### Scenario 4 — Under-Resourced Triage (Business+Ops+Support only, P0 only)
For: "Engineering is buried; help the other three teams urgently."

| Activity | Hours |
|---|---|
| Phase 0–3 | 4 |
| Phase 4 × 10 modules × CAT-B,C,D × P0 only | 60–120 |
| Phase 6 wrap-up for BIZ/OPS/SUP | 8 |
| **Total cross-team effort** | **~75–135 person-hours** |
| **Wall-clock with Coordinator + 1 BA + 1 SRE + 1 Support** | **~2–3 weeks** |

---

## RACI Matrix

| Activity | Coordinator | Eng | QA | BA | SRE | Support | Compliance |
|---|---|---|---|---|---|---|---|
| Run the Praetor skill | **R/A** | C | C | C | C | C | C |
| Validate Discovery Report | A | R | C | R | C | I | R |
| Approve `[ENG]` test cases | A | **R** | **R** | C | I | I | I |
| Execute UAT scripts | A | C | C | **R** | I | C | I |
| Wire alerts & runbooks | A | C | I | I | **R** | C | I |
| Load support playbooks | A | I | I | I | C | **R** | I |
| File audit evidence | A | I | I | I | I | I | **R** |
| Sign off cross-audience wrap-up | **A** | R | R | R | R | R | R |

(R = Responsible, A = Accountable, C = Consulted, I = Informed)

---

## Scaling Rules

Multiply the per-module effort by these factors:

| Repo characteristic | Multiplier |
|---|---|
| Polyglot (2+ primary languages) | × 1.4 |
| Microservices (5+ services) | × 1.3 (more integration tests) |
| Highly regulated (PCI/HIPAA/SOC2) | × 1.5 (heavier `[COMP]` work) |
| Customer-facing with heavy UI | × 1.3 (heavier `[BIZ]` UAT + a11y) |
| Doc-poor repo (no README, no /docs) | × 1.5 (heavier `INFERRED` validation burden) |
| Existing strong test suite | × 0.7 (less automation work) |
| Greenfield, pre-launch | × 1.2 (more invariants to define) |

Stack multipliers compound. Cap at ×3.0; if you'd exceed ×3.0, split the
project into sub-projects and run the kit on each.

---

## Anti-Patterns (Do Not Do This)

1. **Coordinator runs the full prompt and then disappears.** The wrap-up only
   has value if the audience leads review it. Schedule the Phase 3 gate and
   the Phase 6 wrap-up review **before** kicking off Phase 4.
2. **Engineering tries to adopt all five categories alone.** They will skip
   `[BIZ]`, `[OPS]`, `[SUP]`, `[COMP]` because they don't own those domains.
   Distribute to the right teams.
3. **Skipping Phase 3 gate review.** Bad register entries propagate into every
   module. The 3-hour gate review saves days of rework.
4. **Trying to do P0+P1+P2 in one shot for a 30-module repo.** Run P0 first,
   ship that, then come back for P1 and P2.
5. **Treating `INFERRED` items as facts.** Anything marked INFERRED must be
   confirmed with the business team before being treated as authoritative.

---

## Quick-Reference Card

> **5-person team, P0-only run, 10-module SaaS** → about 4 business days
> **11-person team, full run, 15-module SaaS** → about 4 weeks
> **2-person team, single audience (Support), 15-module SaaS** → about 2 weeks
> **Discovery + Gate only (Phase 0–3), any team size** → about 1 business day

Print this card. Stick it on the wall before kickoff.
