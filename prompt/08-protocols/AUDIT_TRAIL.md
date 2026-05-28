# Audit Trail Protocol

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

### Layer classification (first N + any UNKNOWN)
| File | Layer | Confidence | Why (when not obvious) |
|---|---|---|---|

### Module decomposition
| Module ID | Files | Criticality | Reasoning |
|---|---|---|---|

### Files marked UNKNOWN (need review)
<list>

### Exclusions applied
<summary of exclusion patterns hit>
```

## User Action

Read the audit trail. If anything is misclassified, send a correction at the
gate. Otherwise proceed.
