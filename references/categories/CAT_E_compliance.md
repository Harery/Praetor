<!-- Praetor — Production Readiness Audit Skill
     Copyright (c) 2026 Mohamed Elharery (https://github.com/Harery). All rights reserved.
     Project repository: https://github.com/Harery/Praetor
     Licensed under the MIT License; see LICENSE at the repository root. -->

# Category E — Compliance & Security Artifacts `[COMP]`

**Audience**: Compliance / Security. **Mandate**: `references/mandates/MANDATE_compliance.md`.
**Adoption time per module**: 1–2 hours by 1 Compliance Officer.
**Writing standard**: Auditor-facing, with traceable evidence.

## The 4 Compliance Artifacts

> **Agent ownership** (who *generates* each artifact): A16 owns E.1, E.2, E.3;
> A17 owns E.4. A06 provides technical evidence when A16 requests it (the
> A16 → A06 handoff: A16 initiates the request, A06 produces the evidence);
> A16 remains the emitting owner.

### Group E.P0 — Must-have (3 artifacts)

| # | Title | Output |
|---|---|---|
| E.1 | Control Mapping | Per COMP-NNN: control → implementation (`file:line`) → test evidence → gaps |
| E.3 | Data-Flow & PII Map | Per PRV-NNN: data collected, storage, encryption, retention, erasure, lawful basis, cross-border transfers, log exposure |
| E.4 | Risk Register Entries | Per security / compliance risk: severity, mitigation, owner |

### Group E.P1 — Should-have (1 artifact)

| # | Title | Output |
|---|---|---|
| E.2 | Audit Evidence Index | What to show an auditor and where it lives |

## E.1 Control Mapping Format

```
| CM ID | Framework | Control # | Control description | Implementation location | Test evidence (TC IDs) | Gap notes |
```

## E.3 PII Map Format

```
| PRV ID | Data type | PII class | Storage | Encryption | Retention | Erasure path | Lawful basis (GDPR) | Cross-border | Logged |
```

(The columns mirror the PRV register schema 1:1 — see
`references/registers/REGISTERS.md` §2.11. `Cross-border` names the transfer
mechanism or `none`; `Logged` is Y/N — `Y` rows require A06's redaction
check per A06 Rule 4.)

## Frameworks Commonly Detected

- **GDPR** — PII handling, consent, right-to-erasure, data portability
- **PCI-DSS** — Card data handling, network segmentation, logging
- **HIPAA** — PHI handling, access control, audit logs, BAAs
- **SOC2** — Security, availability, processing integrity, confidentiality, privacy
- **WCAG 2.1 AA** — Accessibility (legal requirement in many jurisdictions)
- **ISO 27001** — Information security management
- **CCPA / CPRA** — California consumer privacy

## See Also

- `references/templates/TEMPLATE_compliance_control.md`
