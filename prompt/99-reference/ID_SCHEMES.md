# ID Schemes — All Identifier Formats

Every artifact in the kit uses a structured ID for traceability.
**Eleven schemes total.**

## Generated Artifact IDs

| Scheme | Format | Audience | Example |
|---|---|---|---|
| Engineering Test Case | `TC-<MODULE>-<LAYER>-<SLUG>-<NNN>` | [ENG] | `TC-M_AUTH-CONTROLLER-LOGIN-001` |
| Business Validation | `BV-<MODULE>-<BR>-<NNN>` | [BIZ] | `BV-M_BILLING-BR007-001` |
| UAT Script | `UAT-<MODULE>-<WF>-<NNN>` | [BIZ] | `UAT-M_BILLING-WF012-001` |
| Runbook | `RB-<MODULE>-<SCENARIO>-<NNN>` | [OPS] | `RB-M_PAYMENTS-PROVIDER_OUTAGE-001` |
| Alert | `AL-<MODULE>-<SIGNAL>-<NNN>` | [OPS] | `AL-M_API-LATENCY_P99-001` |
| Support Playbook | `SP-<MODULE>-<ISSUE>-<NNN>` | [SUP] | `SP-M_AUTH-LOGIN_ISSUES-001` |
| Communication Template | `CT-<MODULE>-<SCENARIO>-<NNN>` | [SUP] | `CT-M_AUTH-LOGIN_OUTAGE-001` |
| Compliance Mapping | `CM-<FRAMEWORK>-<CONTROL>-<NNN>` | [COMP] | `CM-SOC2-CC6.1-001` |
| Risk Register Entry | `RR-<MODULE>-<NNN>` | cross-cutting | `RR-M_USERS-001` |
| Root Cause | `RC-<MODULE>-<NNN>` | cross-cutting | `RC-M_AUTH-001` |
| Test Fixture | `FX-<MODULE>-<SCENARIO>-<NNN>` | [ENG] | `FX-M_ORDERS-USER_WITH_SKUS-001` |

> RR (A17 risk), RC (A17 root cause), and FX (test fixtures, see
> `08-protocols/TEST_FIXTURES.md`) are part of the canonical registry.

## Register IDs (set in Phase 2)

| Register | Prefix | Example |
|---|---|---|
| Business Rules | `BR-NNN` | `BR-007` |
| Roles & Personas | `ROLE-NNN` | `ROLE-002` |
| Workflows | `WF-NNN` | `WF-012` |
| State Machines | `SM-NNN` | `SM-003` |
| Invariants | `INV-NNN` | `INV-001` |
| Compliance Markers | `COMP-NNN` | `COMP-014` |
| SLAs & SLOs | `SLO-NNN` | `SLO-002` |
| Error Catalog | `ERR-NNN` | `ERR-101` |
| User-Facing Events | `UX-NNN` | `UX-005` |
| External Dependencies | `DEP-NNN` | `DEP-001` |
| Data Retention / Privacy | `PRV-NNN` | `PRV-003` |
| Configuration Controls | `CFG-NNN` | `CFG-008` |

## Module IDs (set in Phase 1)

Two forms, choose by platform size:
- **`M_<DOMAIN>`** — readable form; use when there are fewer than 20 modules.
  Examples: `M_AUTH`, `M_BILLING`, `M_PAYMENTS`, `M_USERS`.
- **`M01`, `M02`, …** — numeric form; use for very large platforms (≥20 modules).

Use exactly one of these two forms; do not mix them within a run.

## Layer Tags

`FRONTEND_UI` | `FRONTEND_STATE` | `FRONTEND_CLIENT` | `BFF` | `API_GATEWAY` |
`MIDDLEWARE` | `CONTROLLER` | `SERVICE` | `DOMAIN` | `REPOSITORY` |
`INTEGRATION` | `INFRASTRUCTURE` | `SCHEDULER` | `CLI` | `SHARED_UTIL`

## Numbering

- All `<NNN>` slots are 3 digits, zero-padded: 001 through 999.
- Scope is per-module per-type. `TC-M_AUTH-CONTROLLER-LOGIN-001` and
  `TC-M_BILLING-CONTROLLER-INVOICE-001` are both valid; numbering does not
  share across modules.
- Register IDs (BR, WF, etc.) are platform-wide, not per-module.
