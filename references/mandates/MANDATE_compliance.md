<!-- Praetor — Production Readiness Audit Skill
     Copyright (c) 2026 Mohamed Elharery (https://github.com/Harery). All rights reserved.
     Project repository: https://github.com/Harery/Praetor
     Licensed under the MIT License; see LICENSE at the repository root. -->

# Mandate — Compliance & Security Audience `[COMP]`

## Mandate Statement

Compliance owns **regulatory mapping, audit evidence, PII handling, and the
security risk register**. They are auditor-facing and must produce defensible
evidence on demand.

## Scope of Authority

- All `[COMP]` artifacts produced in Category E.
- Compliance framework scope (which of GDPR/PCI/HIPAA/SOC2/WCAG apply).
- Risk severity classifications.
- Audit evidence acceptability.
- PII data flow declarations.

## Hard Responsibilities

1. Validate the Compliance Markers and Data Retention/Privacy registers at the Phase 3 gate.
2. Confirm or correct the framework scope before Phase 4 generation.
3. File audit evidence for each P0 control mapping into the GRC system.
4. Maintain the security risk register with current severities — consuming
   the entries A17 generates (A17 owns generation; the compliance team owns
   adoption, filing, and keeping severities current in the GRC system).
5. Sign off PII data flow maps for completeness.

## Boundaries (Out of Scope)

- Compliance does **not** implement code fixes — they specify requirements.
- Compliance does **not** decide product features — they constrain them.
- Compliance does **not** triage support issues unless privacy-related.

## Inputs Expected

- GRC system access (Vanta/Drata/Tugboat/spreadsheet/etc.).
- Read access to repo and infra configs.
- List of applicable regulatory frameworks and their scope.
- Vendor DPAs and BAAs where applicable.

## Outputs Expected

- Control mapping table filed as audit evidence.
- PII data flow diagram per data subject category.
- Risk register entries with severity, mitigation, owner.
- Quarterly review of INFERRED compliance items.

## Definition of Done

- Every applicable compliance control (`COMP-NNN`) has at least one piece of
  evidence pointing to implementation (`file:line` or config).
- Every PII field has a documented retention and erasure path (`PRV-NNN`).
- Master Traceability Matrix shows GREEN for `[COMP]` on all applicable controls.
- Audit-ready evidence index produced (E.2).

## Auditor-Facing Promise

Every `[COMP]` artifact is structured to be handed directly to an external
auditor without engineering translation. Evidence is traceable to source.

## Escalation Paths

| Issue | Escalate to |
|---|---|
| Required control has no implementation evidence | Engineering for remediation |
| PII field lacks erasure path | Engineering + Business (lawful basis) |
| Risk register entry needs business decision on mitigation | Business + Leadership |
| Vendor missing required DPA/BAA | Legal + Procurement |

## Time Reality

- Control mapping review per framework per module: ~1 hour.
- PII data flow validation per module: ~30 min.
- Risk register entry filing: ~30 min per entry.
- Quarterly framework refresh: ~8 hours per framework.
- Annual time budget per Compliance Officer: ~80 hours for a multi-framework
  platform (SOC2 + GDPR), more if PCI/HIPAA also apply.

## Anti-Patterns

- Filing evidence pointers that go stale after the next refactor (no monitoring
  for control drift).
- Treating `INFERRED` compliance markers as confirmed without explicit review.
- Building risk register entries that don't have owners.
- Letting PII flow maps drift out of sync with actual data collection.
