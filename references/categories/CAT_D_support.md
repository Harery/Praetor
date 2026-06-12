<!-- Praetor — Production Readiness Audit Skill
     Copyright (c) 2026 Mohamed Elharery (https://github.com/Harery). All rights reserved.
     Project repository: https://github.com/Harery/Praetor
     Licensed under the MIT License; see LICENSE at the repository root. -->

# Category D — Support / CX Artifacts `[SUP]`

**Audience**: Support / CX. **Mandate**: `references/mandates/MANDATE_support.md`.
**Adoption time per module**: 1–3 hours by 1 Support Lead.
**Writing standard**: Tier-1 agent, no engineering training, decision-tree style.

## The 8 Support Artifacts

> **Agent ownership** (who *generates* each artifact): A14 owns D.1, D.2, D.3,
> D.6, D.7, D.8; A15 owns D.4, D.5.

### Group D.P0 — Must-have (5 artifacts)

| # | Title | Output |
|---|---|---|
| D.1 | Triage Decision Tree | Symptom → questions → cause → action → escalation |
| D.2 | Known-Issue Log | Seeded from ERR catalog + CHANGELOG, with workarounds |
| D.3 | Error-Message Translation Table | Per user-facing ERR-NNN: plain meaning + self-serve fix |
| D.4 | Customer Communication Templates | Acknowledge / investigating / mitigated / resolved variants |
| D.6 | Escalation Matrix | Issue class → first responder → escalate to → within → required attachments |

### Group D.P1 — Should-have (3 artifacts)

| # | Title | Output |
|---|---|---|
| D.5 | FAQ (module-scoped) | Top customer questions with vetted answers |
| D.7 | Repro-Step Collection Checklist | What support must gather before escalating |
| D.8 | Account-State Cheat Sheet | Per customer-visible SM-NNN: what each state means and allows |

## D.1 Triage Tree Format

```
Symptom: "Customer says X happened"
├─ Clarifying Q1: Have you tried Y?
│  ├─ Yes → Step 2A
│  └─ No → Walk them through Y, retry
├─ Clarifying Q2: Account state?
│  ├─ State A → Resolution path 1
│  └─ State B → Resolution path 2 → if fails, escalate to RB-XYZ
```

## D.3 Translation Table Format

```
| Error code | Plain meaning | Most common cause | Self-serve fix | When to escalate |
```

## See Also

- `references/templates/TEMPLATE_support_playbook.md`
