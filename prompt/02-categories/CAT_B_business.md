# Category B — Business Artifacts `[BIZ]`

**Audience**: Business / Product. **Mandate**: `04-mandates/MANDATE_business.md`.
**Adoption time per module**: 2–4 hours by 1 BA.
**Language rule**: Plain language only. No code unless quoted as evidence.

## The 7 Business Artifacts

### Group B.P0 — Must-have (4 artifacts)

| # | Title | Owner | Output |
|---|---|---|---|
| B.1 | Business Rule Validation Matrix | BA | Plain-language verification per BR |
| B.2 | UAT Scripts | BA | Click-by-click test scripts per WF |
| B.5 | Business Risk Register (module-level) | BA + Product | Risk × likelihood × impact × mitigation |
| B.7 | Pricing / Quota / Limit Verification Grid | BA + Finance | Plan × feature × behavior × overage |

### Group B.P1 — Should-have (3 artifacts)

| # | Title | Owner | Output |
|---|---|---|---|
| B.3 | Success Metrics & Acceptance Criteria | Product | Leading + lagging indicators per WF |
| B.4 | User Journey Maps | Product + BA | Per-persona journeys, Mermaid `journey` |
| B.6 | Change-Impact Checklist | BA | What BIZ must re-verify when this module changes |

## B.1 Format

```
| BR ID | Plain rule | What it protects | How to verify in product (click-by-click) | What "broken" looks like | Severity | Linked tests |
```

## B.2 UAT Format

```
| UAT ID | Scenario | Persona | Setup (plain English) | Steps | Expected outcome | Pass/fail rule |
```

## See Also

- `06-templates/TEMPLATE_uat_script.md` — copy-paste template
