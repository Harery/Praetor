<!-- Praetor — Production Readiness Audit Skill
     Copyright (c) 2026 Mohamed Elharery (https://github.com/Harery). All rights reserved.
     Project repository: https://github.com/Harery/Praetor
     Licensed under the MIT License; see LICENSE at the repository root. -->

# Category B — Business Artifacts `[BIZ]`

**Audience**: Business / Product. **Mandate**: `references/mandates/MANDATE_business.md`.
**Adoption time per module**: 2–4 hours by 1 BA.
**Language rule**: Plain language only. No code unless quoted as evidence.

## The 7 Business Artifacts

> **Agent ownership** (who *generates* each artifact): A10 owns B.1, B.4, B.5,
> B.6, B.7; A11 owns B.2, B.3. The `Owner` column below names the *human role*
> that adopts and maintains the artifact — two different axes.

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

## B.3 Success Metrics Format

```
| WF ID | Leading indicator (predicts success) | Lagging indicator (confirms it) | Measurement source | Review cadence |
```

## B.5 Business Risk Register Format

```
| Risk ID | Plain-language risk | Likelihood (H/M/L) | Business impact | Mitigation | Owner (role) | Linked IDs |
```

## B.6 Change-Impact Checklist Format

```
| BR/WF ID | What to re-verify when this module changes | How (click-by-click or UAT ID) | Who |
```

## B.7 Pricing / Quota Grid Format

```
| Plan | Feature / limit | Expected behavior at limit | Overage behavior | Verified by (UAT/BV ID) |
```

(B.4 User Journey Maps use Mermaid `journey` syntax, one diagram per persona —
no table format. All five blocks above carry the standard artifact fields —
Audience `[BIZ]`, Priority, Status, Agent, Linked IDs — as a header above
the table, like every other artifact.)

## See Also

- `references/templates/TEMPLATE_uat_script.md` — copy-paste template
