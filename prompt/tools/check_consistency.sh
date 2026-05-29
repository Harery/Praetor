#!/usr/bin/env bash
# tools/check_consistency.sh
# Praetor self-consistency guard.
# Catches the defect class that shipped in v2.3: headline numbers that
# disagree across files (judge count, status count, agent count, file count)
# and stale "parallel" / "100% verified" copy.
#
# Usage:  bash tools/check_consistency.sh   (run from repo root)
# Exit 0 = consistent. Exit 1 = at least one drift found.

set -uo pipefail
ROOT="${1:-.}"
fail=0
note() { echo "  -> $*"; }
section() { echo; echo "== $1 =="; }

md_files() { find "$ROOT" -name '*.md' -not -path '*/.git/*' -not -name 'APPLY_PATCHES*' -not -name 'VERSION.md'; }

# Strip lines that are *prohibition guidance* (rules telling authors NOT to use
# a phrase) so the guard doesn't flag the rules that forbid the drift.
drop_guidance() {
  grep -viE 'do not|never (say|print|use)|stale|must be corrected|should say|instead of|rather than|use "re-derived|any doc (saying|claiming)|is stale|incorrectly said|is removed|removed in|2\.3 (said|listed|incorrectly)|now say|replaced by|no longer|column header changes|previously|contradict'
}

# 1. Judge count must be 4 everywhere it is stated.
section "Judge count (must be 4)"
bad=$(grep -rEn '3[- ]judge|all 3 judges|three judges|3 judges' $(md_files) 2>/dev/null | drop_guidance)
if [ -n "$bad" ]; then
  echo "FAIL: found stale 3-judge references:"; echo "$bad"; fail=1
else note "no stale 3-judge references"; fi

# 2. Status-count claims must not be a bare 5 or bare 7 without the +extended note.
section "Status taxonomy framing"
bad=$(grep -rEn '5 (Artifact )?Status|5 status (tags|values)' $(md_files) 2>/dev/null \
      | drop_guidance | grep -vi 'common subset')
if [ -n "$bad" ]; then
  echo "FAIL: bare '5 statuses' claims (should be '7 core + extended'):"; echo "$bad"; fail=1
else note "no bare 5-status claims"; fi

# 3. "parallel" overclaim in user-facing copy.
section "Parallelism wording"
bad=$(grep -rEn 'in parallel|working in parallel|parallel agents' $(md_files) 2>/dev/null \
      | grep -vi 'simulated')
if [ -n "$bad" ]; then
  echo "WARN: 'parallel' used without 'simulated' qualifier:"; echo "$bad"; fi

# 4. "100% verified" guarantee language.
section "Citation guarantee wording"
bad=$(grep -rEn '100% verified|verified 100%|100%-verified' $(md_files) 2>/dev/null | drop_guidance)
if [ -n "$bad" ]; then
  echo "FAIL: over-claimed citation guarantee (use 're-derived at emit'):"; echo "$bad"; fail=1
else note "no '100% verified' guarantees"; fi

# 5. Agent count must be 18.
section "Agent count (must be 18)"
bad=$(grep -rEn '\b[0-9]{1,2} (autonomous |expert )*agents\b' $(md_files) 2>/dev/null \
      | grep -viE 'tier|drop_guidance' | drop_guidance | grep -vE '\b18 ' )
if [ -n "$bad" ]; then
  echo "WARN: agent-count mentions to eyeball:"; echo "$bad"; fi

# 6. Hardcoded total-file counts (should be generated, not asserted).
section "Hardcoded file counts"
bad=$(grep -rEn 'Total (documentation )?files[^|]*\| *[0-9]+' $(md_files) 2>/dev/null)
if [ -n "$bad" ]; then
  echo "FAIL: hardcoded file count found (should say 'run check_consistency.sh'):"
  echo "$bad"; fail=1
else note "no hardcoded file counts"; fi

# 7. Stale "Eight schemes total" ID-registry claim (should be eleven).
section "ID scheme count"
bad=$(grep -rEn 'Eight schemes total|eight schemes' $(md_files) 2>/dev/null | drop_guidance)
if [ -n "$bad" ]; then
  echo "FAIL: stale 'Eight schemes' claim (RR/RC/FX make it eleven):"; echo "$bad"; fail=1
else note "no stale ID-scheme count"; fi

# 8. Contradictory module-ID form M0X-<...>.
section "Module ID form"
bad=$(grep -rEn 'M0X-' $(md_files) 2>/dev/null | drop_guidance)
if [ -n "$bad" ]; then
  echo "FAIL: contradictory module-ID form 'M0X-<...>' (use M_<DOMAIN> or M01):"; echo "$bad"; fail=1
else note "no contradictory module-ID form"; fi

# Report the REAL counts so docs can reference them.
section "Actual counts (source of truth)"
echo "Total .md files : $(md_files | wc -l | tr -d ' ')"
echo "Agent charters  : $(find "$ROOT" -name 'AGENT_*.md' | wc -l | tr -d ' ')"
echo "Protocol files  : $(find "$ROOT" -path '*08-protocols*' -name '*.md' | wc -l | tr -d ' ')"

echo
if [ "$fail" -eq 0 ]; then echo "CONSISTENCY: PASS"; else echo "CONSISTENCY: FAIL"; fi
exit "$fail"
