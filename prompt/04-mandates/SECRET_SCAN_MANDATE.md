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

| Class | Signal |
|---|---|
| Cloud keys | `AKIA[0-9A-Z]{16}` (AWS), `AIza[0-9A-Za-z_\-]{35}` (GCP) |
| Generic API keys | `(api[_-]?key|secret|token)\s*[:=]\s*['"][^'"]{16,}['"]` |
| Private keys | `-----BEGIN (RSA|EC|OPENSSH|PGP) PRIVATE KEY-----` |
| JWT signing fallback | `JWT_SECRET` with a literal default (e.g. `|| 'dev-secret'`) |
| DB URLs w/ creds | `(postgres|mysql|mongodb)://[^:]+:[^@]+@` |
| High-entropy literals | base64/hex string ≥ 32 chars assigned to a name containing secret/key/token |

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
description = "JWT signing secret with hardcoded fallback"
regex = '''JWT_SECRET[^\n]{0,40}(\|\||or)[^\n]{0,10}['"][^'"]{6,}['"]'''
[allowlist]
description = "Test fixtures use deterministic non-production hashes"
paths = ['''tests/fixtures/.*''']
```

## CI placement (amends CAT_A pipeline)

```
PR pipeline:    lint → secret-lint → typecheck → unit → integration → contract
Nightly:        + e2e + api + a11y + perf-smoke + security-scan + secret-scan(full-history) + chaos
```

## Status tags

- `READY` — config runs as-is against the repo
- `READY_EXPOSES_BUG` — secret-lint will fail today because a real secret is committed
- `BLOCKED_NEEDS_INSTRUMENTATION` — repo history not available (shallow clone) for full-history scan

## Refusal / discipline

- A06 NEVER prints an unmasked secret, even in a CRITICAL finding.
- Finding a committed secret is automatically CRITICAL and demands rotation —
  detection alone does not remediate; the secret is considered compromised.
