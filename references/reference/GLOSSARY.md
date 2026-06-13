<!-- Praetor — Production Readiness Audit Skill
     Copyright (c) 2026 Mohamed Elharery (https://github.com/Harery). All rights reserved.
     Project repository: https://github.com/Harery/Praetor
     Licensed under the MIT License; see LICENSE at the repository root. -->

# Plain-Language Glossary

This glossary is for BIZ, OPS, and SUP audiences who encounter kit output
without a technical background. Engineering audiences may skip this file.

## Status Terms

**READY** — Ready to use as-is. No further work needed before adoption.

**READY_EXPOSES_BUG** — This test is correctly written and ready to run,
but when you run it, the code will fail it. That's the point — the test
exposes a real bug. Treat the failure as confirmation that the bug exists,
not as a defect in the test.

**INFERRED** — We inferred this from incomplete signals. Someone needs to
confirm it before we treat it as fact. Like noticing a doormat outside an
apartment and inferring someone lives there — probably true, but worth
confirming.

**BLOCKED_BY_MISSING_CODE** — The test refers to code that doesn't exist
in this repo yet. The test is correct in concept but cannot execute until
the code is written.

**DUPLICATE_OF_<id>** — This scenario is already tested elsewhere (same
component, same scenario, same layer). We point to the existing test
instead of creating a duplicate.

**RELATED_TO_<id>** — This scenario is tested elsewhere but at a different
architectural layer. Both tests are kept because they cover distinct
concerns. (E.g., backend test confirms 404 returned; UI test confirms
the user sees an error message.)

**DEFERRED_TO_<target>** — Intentionally out of scope for this run. Not
forgotten; just scheduled for later. The target may be a phase, module, or
named milestone/owner (e.g., DEFERRED_TO_LAUNCH).

**NO_WORK_FOUND** — Agent analyzed the scope and found nothing applicable.
Different from skipping — this is an explicit, audited "I checked and
there's nothing for me to do here."

**QC_FAILED** — Quality Council flagged this artifact. The flag explains
why. Often means it needs rework before adoption.

**AUDIT_GAP** — A compliance control is required but evidence is missing
or insufficient. Auditors will want this addressed.

### Common extended statuses (full set in `references/protocols/ARTIFACT_STATUS.md`)

**BLOCKED_BY_TEST_DATA** — The test is fine, but the starting data state it
needs can't be created yet (often because a database table doesn't exist).

**BLOCKED_PENDING_RUNBOOK** — The alert is sound, but the on-call procedure
it should link to hasn't been written yet. Alerts never ship without one.

**BLOCKED_NEEDS_INSTRUMENTATION** — The failure is real but invisible: no
metric or log exists to detect it. Observability work comes first.

**BLOCKED_NO_UI_PATH** — The rule exists only in code; there's no screen or
button a person could use to verify it. Engineering verifies instead.

**MANUAL_VERIFICATION_REQUIRED** — Automation can't check this (e.g., how a
screen reader announces a form); a human walkthrough is needed.

**INFERRED_FAILURE_MODE** — A failure we predict from reading the code but
have never seen happen. The runbook is precautionary.

**UNTESTABLE_AS_WRITTEN** — The code can't be tested in isolation until it's
restructured. The finding is about the code's shape, not the test.

## Priority Terms

**P0 — Critical** — Must address before launch / next release.
Roughly 15-30% of items.

**P1 — High** — Should address in the current sprint/cycle.
Roughly 30-50% of items.

**P2 — Standard** — Address as capacity allows.
Roughly 30-50% of items.

## Document Type Terms

**TC — Test Case** — A specific test scenario engineering can run.

**BV — Business Validation** — A plain-language verification matrix
business analysts can run without code.

**UAT — User Acceptance Test** — Click-by-click acceptance script,
usually executed by QA or product team in staging.

**RB — Runbook** — On-call response procedure for operations.

**AL — Alert** — Monitoring alert specification (Datadog query, etc.).

**SP — Support Playbook** — Triage decision tree for customer support.

**CT — Communication Template** — Pre-written customer-facing message.

**CM — Control Mapping** — Maps a compliance framework control to its
implementation evidence.

**RR — Risk Register Entry** — A risk with severity, likelihood, owner,
mitigation, and effort estimate.

**RC — Root Cause** — A single underlying bug that multiple tests may
target (e.g., "missing labels" might generate 2-3 separate tests).

**FX — Test Fixture** — A ready-to-run seed script (SQL or equivalent) that
creates the data state a test needs before it can run. Fixtures are shared
across tests where possible; the Phase 6 Fixture Report counts the distinct
fixtures — the actual setup work the team must build.

## Register Terms

**BR — Business Rule** — A "must" or "cannot" rule the system enforces.
Example: "Orders cannot be canceled after shipping."

**ROLE — User Role** — A persona with distinct permissions.
Example: admin, member, viewer.

**WF — Workflow** — A multi-step user-facing sequence.
Example: "Place order → Pay → Receive confirmation."

**SM — State Machine** — An entity with explicit states and transitions.
Example: orders move through pending_payment → paid → shipped.

**INV — Invariant** — Something that must always be true.
Example: "An email is unique within an organization."

**COMP — Compliance Marker** — A regulatory/standard requirement.
Example: GDPR Article 17, SOC2 CC6.1.

**SLO — Service Level Objective** — A measurable target.
Example: "API p99 latency < 300ms."

**ERR — Error Code** — A distinct error returned to users.
Example: ERR_INSUFFICIENT_INVENTORY.

**UX — User-Facing Event** — A notification, email, or in-app message.

**DEP — External Dependency** — A third-party service we call.
Example: Stripe, SendGrid.

**PRV — Privacy/PII Field** — A piece of personal data with a retention policy.

**CFG — Configuration Control** — An environment variable or feature flag.

## Audience Tags

**[ENG]** — Engineering & QA — software engineers, QA testers.

**[BIZ]** — Business — BAs, product managers, executives.

**[OPS]** — Operations / SRE — site reliability, on-call engineers.

**[SUP]** — Support / CX — customer support, success teams.

**[COMP]** — Compliance & Security — security engineers, compliance officers, auditors.

## Cycle Terms

**Phase 0–6** — The 7 phases a Praetor run moves through. Phase 3 is the
gate where you (the human) reply with answers; Phase 6 is the wrap-up.

**Coverage Ledger** — A running list of every artifact emitted, used to
prevent duplication across modules.

**Audit Trail** — The first thing Praetor shows you: a short log of what it
read, what it skipped, and why. It precedes the Discovery Report in Phase 3.

**Discovery Report** — The Phase 3 summary of everything Praetor learned
about your system (modules, rules, roles, workflows). It ends with the
MUST CONFIRM block and waits for your reply before any artifacts are
generated.

**MUST CONFIRM block** — A section in the Discovery Report listing
inferred items that need confirmation before generation proceeds.

**Gate replies** — The short commands you type at the Phase 3 gate (and
later): `continue` (proceed), `halt` (stop and snapshot), `correct:` (fix
an inferred item), `continue with:` (proceed with amendments),
`override:` (narrow the run scope, e.g. to specific modules or priorities),
`continue module` (resume a chunked module's output). A plain *question* at
the gate is not a command — it's answered in place and the gate is re-shown,
with no state lost. Defined in the Conditional Continue protocol.

**Resumable Snapshot** — A compact plain-text block Praetor emits on
`halt`. Copy it and paste it back in a later session to resume the run
exactly where it stopped, without re-running discovery.

**Citations Index** — A table at the end of every module listing each
`file:line` reference used, re-derived by the Quality Council before
emission. It is a reviewed draft — spot-check it before using it as
audit evidence.

**Agent A01–A17** — The 17 specialist agents (18 personas counting the A00 Orchestrator). Each has a defined scope
and authority. You don't talk to them individually; the Orchestrator
dispatches them.

**Quality Council (QC)** — A 4-judge review panel (Coverage, Correctness,
Clarity, Skip-Validity) that reviews every artifact before emission.

**HANDOFF** — A Praetor-specific message one agent sends another (always
routed by the Orchestrator) to request work: "A06 → A17, this CRITICAL
finding needs a risk entry." The complete set of who-hands-to-whom is the
Canonical Handoff Registry in `references/protocols/HANDOFF_PROTOCOL.md`.

**SNAPSHOT_TOKEN** — A fingerprint of your source (a git commit SHA, an
upload date, or a file count+size+date fingerprint for local folders) stored
in a Resumable Snapshot, so a resumed run can tell whether your code changed
since you stopped.

**SNAPSHOT_DRIFT** — The warning Praetor raises on resume when the live
source's SNAPSHOT_TOKEN no longer matches the one in your pasted snapshot —
i.e., the code changed. Praetor asks whether to re-discover before continuing
rather than trusting stale state.

## Business & Severity Terms

**MRR — Monthly Recurring Revenue** — The predictable subscription revenue a
SaaS earns per month. Used as the default materiality yardstick for P0
classification ("material revenue loss" defaults to >1% of MRR per day).

**Sev1 / Sev2 — Incident Severity** — Industry-standard incident grades:
Sev1 is a critical outage (major functionality down, broad customer impact);
Sev2 is a serious but narrower degradation. A failure that would trigger
either is P0 by the priority rubric.

## "What should I read first?" by Role

- **BA / Product Owner**: Phase 3 Discovery Report, then [BIZ] artifacts (BV + UAT)
- **QA Lead**: Phase 3 + [ENG] test cases
- **SecEng**: Risk Register (RR) + [ENG] security tests
- **SRE**: [OPS] runbooks + alerts + Phase 6 tooling recommendations
- **Support**: [SUP] triage trees + comm templates
- **Compliance**: [COMP] control mappings + AUDIT_GAP items
- **Leadership**: Phase 6 wrap-up only — Priority-Banded Gap Report + Risk Register Master View
