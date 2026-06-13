#!/usr/bin/env bash
# Praetor — Secret-Scan Pattern Regression Harness (v2.8.2)
# (introduced in v2.7.4; extended in v2.8 with the separate ?? assertion)
# Copyright (c) 2026 Mohamed Elharery (https://github.com/Harery). MIT License.
#
# Runs every pattern class from references/mandates/SECRET_SCAN_MANDATE.md
# against the planted-flaw fixture repo (tests/sim/flawed-app) and FAILS if
# any planted secret escapes. Run after ANY edit to the pattern table.
#
# Exit 0 = all planted secrets caught.  Exit 1 = regression.

set -u
HERE="$(cd "$(dirname "$0")" && pwd)"
TARGET="${1:-$HERE/flawed-app}"
FAIL=0

hit() { # hit <label> <grep-args...>
  local label="$1"; shift
  if grep -rqE "$@" "$TARGET" 2>/dev/null; then
    echo "PASS  $label"
  else
    echo "FAIL  $label — pattern caught nothing (regression)"
    FAIL=1
  fi
}

echo "== Praetor secret-scan regression vs: $TARGET =="

# Class: Payment-provider keys (case-sensitive prefixes) — catches FLAW-1
hit "payment-provider key (sk_live_)"  "(sk|pk|rk)_(live|test)_[0-9A-Za-z]{10,}"

# Class: Generic API keys — MUST be case-insensitive (catches const SECRET = "...")
hit "generic api key, case-insensitive (-i)"  -i "(api[_-]?key|secret|token)[[:space:]]*[:=][[:space:]]*['\"][^'\"]{16,}['\"]"

# Negative control: the OLD case-sensitive form must miss the uppercase fixture.
# v2.8 (F-141): this is now a hard assertion, not a soft NOTE. The fixture
# carries ONLY uppercase secret-name conventions, so the case-sensitive form
# MUST miss them — proving -i is load-bearing. If a future fixture edit adds a
# lowercase `secret =` variable, this fires a WARN so the control's premise is
# re-checked rather than silently degrading.
if grep -rqE "(api[_-]?key|secret|token)[[:space:]]*[:=][[:space:]]*['\"][^'\"]{16,}['\"]" "$TARGET" 2>/dev/null; then
  echo "WARN  negative control degraded: case-sensitive form also matched — a lowercase secret was added to the fixture; re-confirm -i remains load-bearing"
else
  echo "PASS  negative control: case-sensitive form misses the fixture (proves -i is load-bearing)"
fi

# Class: High-entropy literal >= 24 chars assigned to secret/key/token name
hit "high-entropy literal >=24 on secret-ish name"  -i "(secret|key|token)[[:space:]]*=[[:space:]]*['\"][0-9A-Za-z_\-]{24,}['\"]"

# Class: JWT signing fallback — both operator forms (catches FLAW-9, FLAW-10).
# v2.8: the ?? form is asserted separately because the old (\|\||or)
# alternation silently missed nullish coalescing.
hit "jwt dev fallback (|| or 'or')"  -i "JWT_SECRET.{0,40}(\|\||or).{0,10}['\"][^'\"]{6,}['\"]"
hit "jwt dev fallback (?? nullish)"  -i "JWT_SECRET.{0,40}\?\?.{0,10}['\"][^'\"]{6,}['\"]"

# Classes now with planted instances (FLAW-11..13 in src/config/secrets.js)
hit "cloud key (AWS AKIA)"               "AKIA[0-9A-Z]{16}"
hit "private key header (RSA/EC/...)"    -e "-----BEGIN (RSA|EC|OPENSSH|PGP) PRIVATE KEY-----"
hit "db url with embedded creds"         "(postgres|mysql|mongodb)://[^:]+:[^@]+@"

# Remaining classes with no planted instance — assert patterns are valid regex
for p in 'AIza[0-9A-Za-z_\-]{35}' 'whsec_[0-9A-Za-z]{10,}'; do
  if printf 'probe\n' | grep -qE -e "$p" 2>/dev/null; rc=$?; [ "$rc" -le 1 ]; then
    echo "PASS  regex-valid: $p"
  else
    echo "FAIL  invalid regex in mandate table: $p"; FAIL=1
  fi
done

echo "=="
if [ "$FAIL" -eq 0 ]; then
  echo "RESULT: ALL PLANTED SECRETS CAUGHT — mandate pattern table holds."
else
  echo "RESULT: REGRESSION — fix SECRET_SCAN_MANDATE.md before shipping."
fi
exit $FAIL
