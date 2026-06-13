<!-- Praetor — Production Readiness Audit Skill
     Copyright (c) 2026 Mohamed Elharery (https://github.com/Harery). All rights reserved.
     Project repository: https://github.com/Harery/Praetor
     Licensed under the MIT License; see LICENSE at the repository root. -->

# Secret Scanning & Secret-Lint — A06 Sub-Mandate

> A06 emits hardcoded-secret detection as two artifacts: a masked findings
> table and a runnable secret-lint CI stage that runs on every commit.
> The capability list promises **secret-key scan** AND **secret-lint** as
> first-class test types; this file makes both concrete, executable, and
> CI-wired.

## Owner

Agent **A06 (Security)**. Emitted as part of Category A `[ENG]`, type = `security`,
sub-type = `secret-scan`.

## Two distinct deliverables

### 1. Secret-Key Scan (findings)
A06 statically scans every in-scope file for committed secrets and emits a
findings table. Patterns to flag (non-exhaustive):

> **Case rule (mandatory):** every pattern below matches **case-insensitively**
> unless the key format itself is case-defined (AWS `AKIA…`, GCP `AIza…`,
> payment-provider prefixes). Identifier-name patterns MUST catch the
> uppercase-constant convention — `const SECRET = "…"`, `API_KEY=…`,
> `Token: "…"` are all hits. When emitting grep/gitleaks rules, prepend `(?i)`
> (or pass `-i`) on every identifier-name pattern. v2.7.4: a live fixture run
> proved the generic pattern silently misses `const SECRET = "…"` without this.

> **Copy patterns from the runnable sources, never from this table.** Inside
> the markdown table cells below, every `\|` is a *markdown escape* for the
> regex alternation `|` (unescaped pipes would break the table). The
> canonical, runnable form of each pattern lives in
> `tests/sim/check_secrets.sh` and in the config blocks further down — when
> you emit a gitleaks rule or grep command, derive it from those, with plain
> `|` alternation.

| Class | Signal |
|---|---|
| Cloud keys | `AKIA[0-9A-Z]{16}` (AWS), `AIza[0-9A-Za-z_\-]{35}` (GCP) |
| Payment-provider keys | `(sk\|pk\|rk)_(live\|test)_[0-9A-Za-z]{10,}` (Stripe-style), `whsec_[0-9A-Za-z]{10,}` (webhook signing) — case-sensitive prefixes; any `_live_` hit is auto-CRITICAL |
| Generic API keys | `(?i)(api[_-]?key\|secret\|token)\s*[:=]\s*['"][^'"]{16,}['"]` |
| Private keys | `-----BEGIN (RSA\|EC\|OPENSSH\|PGP) PRIVATE KEY-----` |
| JWT signing fallback | `(?i)JWT_SECRET` with a literal default — pipe-pipe, `or`, or nullish-coalescing `??` fallback operators (runnable regex: the `jwt-dev-fallback` rule in the `.gitleaks.toml` block below; this row stays prose because pipes inside table cells are ambiguous). Ternary fallbacks (`JWT_SECRET ? … : 'literal'`) are caught by manually reviewing every JWT_SECRET hit |
| DB URLs w/ creds | `(postgres\|mysql\|mongodb)://[^:]+:[^@]+@` |
| High-entropy literals | `(?i)(secret\|key\|token)\s*=\s*['"][0-9A-Za-z_\-]{24,}['"]` — base64/hex string **≥ 24 chars** assigned to a secret-ish name (threshold lowered from 32 in v2.7.4 — 30-char live-style keys escaped the old floor) |

A regression harness for this table lives at `tests/sim/` — `check_secrets.sh`
exercises every pattern class against the planted-flaw fixture repo (positive
planted-secret hits where the fixture carries an instance; regex-validity
probes for classes with no planted instance) and fails if any planted secret
escapes. Run it after ANY edit to this table, and when adding a pattern
class, plant a matching flaw in `tests/sim/flawed-app/` first — red, then
green.

Each hit → **CRITICAL** Risk Register entry (A06 has veto authority) +
`file:line` + recommended rotation. A06 NEVER reproduces the full secret value
in the artifact; it shows a masked prefix (`AKIA****`) and the location only.

### 2. Secret-Lint (executable CI stage)
A06 also emits a ready-to-run config so the team can enforce this in CI
continuously — not just once. Default tool: **gitleaks** (open-source, no
account). Adapt to detected tooling via A03 (e.g. `trufflehog`, GitHub
secret scanning) when present.

```yaml
# .github/workflows/secret-lint.yml   (emitted artifact, STATUS: READY)
name: secret-lint
on: [push, pull_request]
jobs:
  gitleaks:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with: { fetch-depth: 0 }
      - name: gitleaks
        uses: gitleaks/gitleaks-action@v2
        env:
          GITLEAKS_CONFIG: .gitleaks.toml
```

```toml
# .gitleaks.toml   (emitted artifact, STATUS: READY)
title = "Praetor secret-lint baseline"
[extend]
useDefault = true
[[rules]]
id = "jwt-dev-fallback"
description = "JWT signing secret with hardcoded fallback (||, or, ??)"
regex = '''(?i)JWT_SECRET[^\n]{0,40}(\|\||or|\?\?)[^\n]{0,10}['"][^'"]{6,}['"]'''
[allowlist]
description = "Non-production test-data hashes only — NOT the Praetor self-test fixture"
# Allowlist the consuming project's own fixture dir here (e.g. tests/fixtures/).
# Do NOT allowlist Praetor's tests/sim/flawed-app/ — its planted secrets MUST
# stay detectable; allowlisting it would defeat the regression harness.
paths = ['''tests/fixtures/.*''']
```

**Allowlist discipline:** the allowlist is itself an attack surface — a
secret moved under an allowlisted path evades the scan. A06 reviews every
allowlist path on every run, lists allowlisted hits in the Secret Findings
table with status `ALLOWLISTED (reviewed)` instead of dropping them, and
flags any allowlist change made outside an audit run as a finding.

**Prevention (emit alongside detection):** recommend `.gitignore` entries for
`.env`, `.env.*` (except `.env.example`), `*.pem`, `*.key`, and any detected
secrets-file path — keeping secrets out of history beats catching them after
commit. If the platform supports it (e.g., GitHub push protection), recommend
enabling it. When A03 detected a different scanning stack (trufflehog,
detect-secrets, GitHub secret scanning), emit the equivalent config for that
tool instead of gitleaks — same patterns, adapted syntax.

## CI placement (convenience copy — canonical pipeline lives in `references/categories/CAT_A_engineering.md`)

```
PR pipeline:    lint → secret-lint → typecheck → unit → integration → contract
Nightly:        + e2e + api + a11y + perf-smoke + security-scan + secret-scan(full-history) + chaos (P2)
```

## Status tags

- `READY` — config runs as-is against the repo
- `READY_EXPOSES_BUG` — secret-lint will fail today because a real secret is committed
- `BLOCKED_NEEDS_INSTRUMENTATION` — repo history not available (shallow clone) for full-history scan

## Refusal / discipline

- A06 NEVER prints an unmasked secret, even in a CRITICAL finding.
- Finding a committed secret is automatically CRITICAL and demands rotation —
  detection alone does not remediate; the secret is considered compromised.
