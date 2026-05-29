---
name: praetor
description: "Production-readiness audit and test-generation system. Use when the user wants to QA, audit, review, harden, or assess a codebase or service for production readiness, or asks to generate test cases, runbooks, alert specs, support triage trees, customer-comms templates, compliance mappings (SOC2/GDPR/HIPAA/PCI/WCAG), or a consolidated risk register from source. Trigger on phrases like 'audit my code', 'QA review', 'readiness check', 'find bugs', 'security review', 'compliance audit', 'write tests for my repo', 'harden this service', 'is this ready to ship', 'pre-launch review', 'production readiness', or when a user supplies a repo/codebase and asks for a thorough multi-discipline review. Dispatches 18 expert agent personas across 7 phases and 5 audiences with file-line traceability."
version: "2.5"
license: "Use, modify, and share freely. Attribution appreciated, not required."
---

# Praetor — Production Readiness, Audit, Evidence, Testing, Operations & Review

Praetor turns any codebase into a complete production-readiness package with
file-line traceability. It runs as a single model adopting 18 expert agent
personas across 7 phases, serving 5 audiences (Engineering, Business,
Operations, Support, Compliance), reviewed by a 4-judge Quality Council.

## How to run it

1. Open `00-orchestrator/MASTER_PROMPT.md` and load it as the operating
   instruction set (it is the front door / orchestrator).
2. Provide the source the user wants audited:
   `Source: <github URL | local path | uploaded files>`.
3. Phases 0–2 run silently (source resolution, technical discovery, domain
   mapping + tooling discovery).
4. Emit the Phase 3 Discovery Report with a MUST CONFIRM block, then wait for
   the user to reply per the Conditional Continue protocol
   (`08-protocols/CONDITIONAL_CONTINUE.md`).
5. Run the per-module agent swarm (Phase 4), review each artifact inline with
   the Quality Council (Phase 5), and emit the mandatory cross-audience
   wrap-up (Phase 6).
6. On `halt`, emit a Resumable Snapshot (`08-protocols/RESUMABLE_STATE.md`)
   so a later session can continue without re-running discovery.

## Where things live

- **Orchestrator / entry point:** `00-orchestrator/MASTER_PROMPT.md`,
  `00-orchestrator/AGENT_ROSTER.md`
- **Phases (7):** `01-phases/`
- **Audience categories (5):** `02-categories/`
- **Registers (12 types):** `03-registers/REGISTERS.md`
- **Per-audience mandates + secret scan:** `04-mandates/`
- **Run configuration & timelines:** `05-execution/`
- **Artifact templates:** `06-templates/`
- **Agent charters (18 + Quality Council):** `07-agents/`
- **Inter-agent protocols (13):** `08-protocols/`
- **Quick reference, glossary, ID schemes, counts:** `99-reference/`
- **First-time users:** `GETTING_STARTED.md`
- **Self-consistency check:** `tools/check_consistency.sh`

## Operating principles

- **Autonomous expert agents** — each operates without supervision in its
  scope, with declared persona, authority, and refusal conditions. Agents are
  sequentially-simulated personas within one context, not parallel processes.
- **Re-derived citations** — every `file:line` claim is re-opened before emit
  by Quality Council Judge 2. This is a single-model discipline, not external
  certification; the Citations Index is a reviewed draft for human spot-check.
- **Layer-aware coverage** — `DUPLICATE_OF` for same-layer matches,
  `RELATED_TO` for cross-layer scenarios.
- **Tooling-adaptive output** — detects CI/monitoring/help-desk tools by
  config / dependency / env-var name (never by reading secret values) and
  adapts artifact format; generic format with adoption advice otherwise.
- **Universal Agent Discipline** — six rules (U1–U6) every agent obeys; see
  `08-protocols/UNIVERSAL_AGENT_DISCIPLINE.md`.

## What it does not do

It produces specifications; it does not execute tests, deploy fixes, send
communications, or file tickets. Citations are re-derived, not externally
certified — spot-check before using as audit evidence.

Canonical counts are in `99-reference/BY_THE_NUMBERS.md`. Do not hardcode a
total file count; run `tools/check_consistency.sh` for live totals and a
self-consistency check.
