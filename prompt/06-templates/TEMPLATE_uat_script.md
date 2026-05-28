# Template — UAT Script `[BIZ]`

```
| UAT ID                | UAT-M_BILLING-WF012-001                          |
| Audience              | [BIZ]                                            |
| Priority              | P0                                               |
| Linked IDs            | WF-012 (monthly billing cycle), BR-007 (rounding) |
| Scenario              | Monthly invoice generation for an active subscription |
| Persona               | org_owner (ROLE-002)                             |
| Pre-Setup             | A test organization with an active Pro subscription, billing day = today, last invoice paid |
| Steps                 | 1. Log in as org_owner of test org <br> 2. Navigate to Billing → Invoices <br> 3. Wait for nightly billing job (or trigger manually if admin) <br> 4. Refresh invoices page |
| Expected Outcome      | New invoice appears with status "issued"; amount = monthly plan price; tax line correct; PDF downloads successfully; receipt email arrives at org_owner address within 5 minutes |
| Pass/Fail Rule        | PASS if all expected outcomes are observed. FAIL if invoice missing, amount wrong, PDF broken, or email not received. |
```

## Conventions

- Plain language. Assume reader is a BA or PM, not an engineer.
- Steps describe clicks/navigations, not API calls.
- "Pre-Setup" describes the world state in plain English.
- "Pass/Fail Rule" is a single declarative sentence — no ambiguity.
