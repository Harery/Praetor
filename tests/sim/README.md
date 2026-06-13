<!-- Praetor — Production Readiness Audit Skill
     Copyright (c) 2026 Mohamed Elharery (https://github.com/Harery). All rights reserved.
     Project repository: https://github.com/Harery/Praetor
     Licensed under the MIT License; see LICENSE at the repository root. -->

# tests/sim — Regression Harness

This directory closes the open recommendation carried since v2.7.1: defects kept
being introduced by the previous audit's fixes, in a shape no amount of *reading*
reliably caught. Two executable guards now catch them mechanically.

## What's here

- **`flawed-app/`** — a tiny planted-flaw fixture repo (13 known defects across
  auth + billing + config) used as seed corpus. It is intentionally insecure; it
  exists only to prove the audit machinery fires. Planted flaws include a
  hardcoded `sk_live_` secret, SQL injection, plaintext password compare, default
  role-escalation in a JWT, a non-idempotent refund, a missing `UNIQUE(email)`
  constraint, JWT dev-secret fallbacks in both `||` and nullish-coalescing `??`
  forms (FLAW-9/FLAW-10), and — in `src/config/secrets.js` — an AWS access key,
  a postgres URL with embedded credentials, and an inline RSA private key
  (FLAW-11/12/13, so the cloud-key / DB-URL / private-key pattern classes have
  live positive coverage, not just regex-validity probes).
- **`check_secrets.sh`** — runs every pattern class from
  `references/mandates/SECRET_SCAN_MANDATE.md` against the fixture and FAILS if
  any planted secret escapes. This is the regression test for the v2.7.4
  secret-scan fixes (case-insensitive matching, payment-provider key class,
  lowered entropy threshold).

## Running

```bash
# from the skill root:
tests/sim/check_secrets.sh        # secret-scan pattern regression
tools/check_consistency.sh        # schema-conformance + counts + links + markers
```

Both exit `0` on success, `1` on any violation — wire them as the gate before
any future feature edit. `tools/check_consistency.sh` invokes
`check_secrets.sh` as its final stage, so running the consistency checker alone
covers both.

## Why a fixture and not unit tests

Praetor emits specifications, not running code, so its "tests" assert that the
spec's *detection rules* actually match real source. A fixture repo is the only
way to exercise a regex-based mandate end-to-end. When you extend the pattern
table or add a new agent rule, add a matching planted flaw here first, watch the
harness fail, then fix the mandate until it passes — red/green discipline for a
spec-only tool.
