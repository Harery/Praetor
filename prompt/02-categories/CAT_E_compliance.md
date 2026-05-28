# Category E — Compliance & Security Artifacts `[COMP]`

**Audience**: Compliance / Security. **Mandate**: `04-mandates/MANDATE_compliance.md`.
**Adoption time per module**: 1–2 hours by 1 Compliance Officer.
**Writing standard**: Auditor-facing, with traceable evidence.

## The 4 Compliance Artifacts

### Group E.P0 — Must-have (3 artifacts)

| # | Title | Output |
|---|---|---|
| E.1 | Control Mapping | Per COMP-NNN: control → implementation (`file:line`) → test evidence → gaps |
| E.3 | Data-Flow & PII Map | Per PRV-NNN: data collected, storage, retention, erasure, lawful basis |
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
| PRV ID | Data type | PII class | Storage | Encryption | Retention | Erasure path | Lawful basis (GDPR) |
```

## Frameworks Commonly Detected

- **GDPR** — PII handling, consent, right-to-erasure, data portability
- **PCI-DSS** — Card data handling, network segmentation, logging
- **HIPAA** — PHI handling, access control, audit logs, BAAs
- **SOC2** — Security, availability, processing integrity, confidentiality, privacy
- **WCAG 2.1 AA** — Accessibility (legal requirement in many jurisdictions)
- **ISO 27001** — Information security management
- **CCPA / CPRA** — California consumer privacy

## See Also

- `06-templates/TEMPLATE_compliance_control.md`
