<!-- Praetor — Production Readiness Audit Skill
     Copyright (c) 2026 Mohamed Elharery (https://github.com/Harery). All rights reserved.
     Project repository: https://github.com/Harery/Praetor
     Licensed under the MIT License; see LICENSE at the repository root. -->

# Audit Trail Protocol

> **This file is the canonical Audit Trail format.** The summary in
> A01's charter (`references/agents/AGENT_A01_discovery.md` Rule 3) defers to
> this one; if they ever disagree, this file wins.

## What Gets Audited

A01 Discovery Agent's silent work in Phase 1:
- Files scanned
- Files excluded (with reason)
- Layer classification per source file with confidence
- Module decomposition with rationale
- Stack detection

## When Audit Trail Emits

At the START of Phase 3's Discovery Report, BEFORE any synthesis. This makes
discovery errors catchable before they propagate.

## Format

```
## 🔍 Discovery Audit Trail (Agent A01)

Scope: <N> files scanned, <M> excluded, <K> classified
Confidence: X% CONFIRMED, Y% INFERRED, Z% UNKNOWN

### Layer classification (first 50 + any UNKNOWN)
| File | Layer | Confidence | Why (when not obvious) |
|---|---|---|---|

### Module decomposition
| Module ID | Path | Layers | Files | Criticality | Reasoning |
|---|---|---|---|---|---|

### Files marked UNKNOWN (need review)
<list>

### Exclusions applied
<summary of exclusion patterns hit>
```

Confidence values here are A01's three (CONFIRMED / INFERRED / UNKNOWN);
`ASSUMPTION` does not appear in the Audit Trail — it applies only to opaque
external dependencies handled later, per
`references/reference/FAILURE_RULES.md` §7.

**Large-repo truncation rule:** the classification table shows the first 50
classified files plus EVERY file marked UNKNOWN, then one summary line per
remaining layer ("…and 214 more CONFIRMED SERVICE files"). The module
decomposition table is never truncated. This keeps A01's quality bar
("readable in <5 minutes") honest on 2000-file repos.

## User Action

Read the audit trail. If anything is misclassified, send a correction at the
gate. Otherwise proceed.
