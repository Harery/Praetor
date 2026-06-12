<!-- Praetor — Production Readiness Audit Skill
     Copyright (c) 2026 Mohamed Elharery (https://github.com/Harery). All rights reserved.
     Project repository: https://github.com/Harery/Praetor
     Licensed under the MIT License; see LICENSE at the repository root. -->

# Mandate — Support / CX Audience `[SUP]`

## Mandate Statement

Support owns **customer-facing resolution, communication, and known-issue
tracking**. They are the public voice of the platform when something goes wrong.

## Scope of Authority

- All `[SUP]` artifacts produced in Category D.
- Customer-facing wording in error translations and comm templates.
- Triage decision tree branching logic.
- Escalation thresholds to engineering.
- Help-desk knowledge base content.

## Hard Responsibilities

1. Validate the Error Catalog and User-Facing Events registers at the Phase 3 gate.
2. Load triage decision trees (D.1) into the support workflow tool.
3. Load error translations (D.3) into the help-desk knowledge base.
4. Maintain the Known-Issue Log (D.2) as a living document; close out items
   when engineering resolves them.
5. Approve customer communication templates (D.4) for tone and brand voice.
6. Train tier-1 agents on the triage trees and account-state cheat sheets.

## Boundaries (Out of Scope)

- Support does **not** debug production code.
- Support does **not** set SLO or alert thresholds — that's ops.
- Support does **not** rewrite business rules — they communicate them.

## Inputs Expected

- Help-desk platform access (Zendesk/Intercom/Freshdesk/etc.).
- Knowledge base authoring access.
- Ability to view (read-only) customer accounts in staging.
- Direct line to ops escalation channel.

## Outputs Expected

- Decision trees published in the agent-facing tool.
- Knowledge base articles for every user-facing error.
- Communication templates pre-approved for major scenarios.
- Top-20 FAQ live in the customer-facing help center.
- Monthly known-issue review meeting with engineering.

## Definition of Done

- Every user-facing error (`ERR-NNN` with `user_facing=Y`) has a translation entry.
- Every customer-visible state machine (`SM-NNN`) has an account-state cheat sheet.
- Every P0 issue class has a triage path defined.
- Master Traceability Matrix shows GREEN for `[SUP]` on all user-impact P0 entries.

## Plain-Language Promise

Triage trees and error translations are written for a tier-1 agent with no
engineering training. If any artifact requires reading code, file a quality issue.

## Escalation Paths

| Issue | Escalate to |
|---|---|
| Error message in code doesn't match translation table | Engineering |
| Customer reports issue not in known-issue log | Engineering + Coordinator |
| Triage tree branch leads to dead end (no resolution path) | Engineering for runbook + Support Lead to revise tree |
| Communication template lands poorly with a customer | Marketing/Brand for joint revision |

## Time Reality

- Decision tree adoption per module: ~1 hour.
- Error translation review per module: ~1 hour.
- Knowledge base authoring per major flow: ~2 hours.
- Agent training per module: ~30 min in a team huddle.
- Annual time budget per Support Lead: ~60 hours for a 10-module platform.

## Anti-Patterns

- Publishing internal error codes to customers ("Error 0xCAFEBABE" tells them nothing).
- Skipping agent training; loading content into the KB without anyone knowing it's there.
- Comm templates that promise resolution times the team can't actually meet.
- Letting the known-issue log go stale (items stay "open" for months after engineering shipped a fix).
