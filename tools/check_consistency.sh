#!/usr/bin/env bash
# Praetor — Schema-Conformance & Structure Consistency Checker (v2.8)
# Copyright (c) 2026 Mohamed Elharery (https://github.com/Harery). MIT License.
#
# 10 stages: dead links (md + sh), canonical counts, U4 closed-vocabulary
# (declared inventory + a real usage scan), ID schemes, version markers,
# secret-scan regression, TC slot vocabulary, template mandatory fields,
# file-count assertion vs BY_THE_NUMBERS, and vocabulary-residue sweeps.
#
# Exit 0 = consistent.  Exit 1 = at least one violation.

set -u
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT" || exit 2
FAIL=0
note() { echo "  $*"; }
bad()  { echo "FAIL  $*"; FAIL=1; }
ok()   { echo "PASS  $*"; }

echo "== Praetor consistency check @ $ROOT =="

# 1) Dead-link check: every references/...md path cited must exist (skip templated <>)
#    v2.8: shell scripts' citations are scanned too, not just markdown.
echo "-- 1. link integrity"
miss=0
while read -r p; do
  case "$p" in *"<"*) continue;; esac
  [ -f "$p" ] || { note "missing: $p"; miss=1; FAIL=1; }
done < <(grep -rhoE "references/[A-Za-z0-9_/<>.-]+\.md" --include="*.md" --include="*.sh" \
  --exclude-dir=.git --exclude-dir=.archive --exclude-dir=.remember \
  --exclude-dir=.claude --exclude-dir=.sisyphus . | grep -v '\.\.\.' | sort -u)
[ "$miss" -eq 0 ] && ok "no dead references/ links" || bad "dead links above"

# 2) Canonical counts from BY_THE_NUMBERS must match reality
echo "-- 2. canonical counts"
files_total=$(find . -type f | wc -l | tr -d ' ')
agents=$(ls references/agents/AGENT_A*_*.md 2>/dev/null | wc -l | tr -d ' ')   # A00..A17 = 18
phases=$(ls references/phases/PHASE_*_*.md 2>/dev/null | wc -l | tr -d ' ')
regs=$(grep -cE "^## 2\.[0-9]+ " references/registers/REGISTERS.md)
protos=$(ls references/protocols/*.md 2>/dev/null | wc -l | tr -d ' ')
[ "$agents" -eq 18 ] && ok "agent charters = 18" || bad "agent charters = $agents (want 18)"
[ "$phases" -eq 7 ]  && ok "phase files = 7"     || bad "phase files = $phases (want 7)"
[ "$regs"  -eq 12 ] && ok "register sections = 12" || bad "register sections = $regs (want 12)"
[ "$protos" -ge 13 ] && ok "protocol files >= 13 ($protos)" || bad "protocol files = $protos (want >=13)"
note "total files on disk: $files_total"

# 3) Status-tag / modifier-flag closed vocabulary (U4 enforcement)
#    v2.8: this is now a real usage scan — every status-like token used in
#    any kit file (CHANGELOG history excluded) must be declared in
#    ARTIFACT_STATUS.md. Prior versions only inventoried the declared set.
echo "-- 3. status/flag vocabulary (U4)"
# Declared set = every `CODE` in ARTIFACT_STATUS tables (UPPER_SNAKE, >=4 chars)
grep -oE '`[A-Z][A-Z_]{3,}(_<[a-z]+>)?`' references/protocols/ARTIFACT_STATUS.md \
  | tr -d '`' | sed -E 's/_<[a-z]+>//' | sort -u > /tmp/praetor_declared.txt
declared_n=$(wc -l < /tmp/praetor_declared.txt | tr -d ' ')
ok "declared status/flag tokens: $declared_n"
# Spot-assert the tokens recent audits added really are present
for t in TOOL_AMBIGUITY_NOTE PRIORITY_REBALANCE_NOTE NO_WORK_FOUND QC_FAILED BLOCKED_BY_MISSING_SCHEMA; do
  grep -qx "$t" /tmp/praetor_declared.txt && ok "declared: $t" || bad "undeclared token referenced by audits: $t"
done
# Usage scan: collect backticked UPPER_SNAKE tokens matching status families
# from every kit md (not CHANGELOG/archive — history quotes old defects).
# BLOCKED_BY is allowlisted: it is the artifact *field* name, not a status.
u4_bad=0
while read -r t; do
  [ -z "$t" ] && continue
  [ "$t" = "BLOCKED_BY" ] && continue
  grep -qx "$t" /tmp/praetor_declared.txt \
    || { note "status-like token used but not declared in ARTIFACT_STATUS: $t"; u4_bad=1; FAIL=1; }
done < <(grep -rhoE '`[A-Z][A-Z_]{3,}(_<[a-z]+>)?`' --include="*.md" SKILL.md references 2>/dev/null \
  | grep -v 'CHANGELOG' \
  | tr -d '`' | sed -E 's/_<[a-z]+>//' | sort -u \
  | grep -E '^(READY|READY_EXPOSES_BUG|INFERRED[A-Z_]*|BLOCKED_[A-Z_]+|DEFERRED_TO[A-Z_]*|DUPLICATE_OF|RELATED_TO|NO_WORK_FOUND|QC_FAILED|AUDIT_GAP|OUT_OF_SCOPE|MANUAL_[A-Z_]+|UNTESTABLE[A-Z_]*|UNCORRECTABLE[A-Z_]*|COMPLIANCE_CLAIM[A-Z_]*|LONG_RUNNING[A-Z_]*|REQUIRES_[A-Z_]+|OWNER_REQUIRED|SNAPSHOT_DRIFT|[A-Z_]+_NOTE|OPEN|MITIGATING|MITIGATED|ACCEPTED|CLOSED)$')
[ "$u4_bad" -eq 0 ] && ok "every status-like token in use is declared (usage scan)" || bad "undeclared status tokens above"

# 4) ID schemes: header claims 11 generated schemes
echo "-- 4. id schemes"
idrows=$(awk '/## Generated Artifact IDs/{f=1;next} /^## /{f=0} f&&/^\| [A-Za-z].*`.*<.*>.*`/{c++} END{print c+0}' references/reference/ID_SCHEMES.md)
[ "$idrows" -eq 11 ] && ok "generated ID schemes = 11" || bad "generated ID schemes = $idrows (want 11)"

# 5) Version-family marker policy: embedded markers must be the family, not patch
echo "-- 5. version markers"
manifest=$(grep -oE 'version: "[0-9.]+"' SKILL.md | grep -oE '[0-9.]+')
family=$(echo "$manifest" | grep -oE '^[0-9]+\.[0-9]+')
emb=$( { grep -hoE "SNAPSHOT v[0-9]+\.[0-9]+(\.[0-9]+)?" references/protocols/RESUMABLE_STATE.md; \
         grep -m1 -hoE "Cheat Sheet \(v[0-9]+\.[0-9]+(\.[0-9]+)?\)" references/reference/CHEATSHEET.md; } \
       | grep -oE "v[0-9]+\.[0-9]+(\.[0-9]+)?" | sort -u )
note "manifest=$manifest family=v$family embedded={$(echo $emb | tr '\n' ' ')}"
bad_marker=0
for m in $emb; do
  # embedded marker must equal family (vMAJOR.MINOR), never a 3-part patch
  if echo "$m" | grep -qE "^v[0-9]+\.[0-9]+$"; then
    [ "$m" = "v$family" ] || { note "stale family marker: $m (want v$family)"; bad_marker=1; FAIL=1; }
  else
    note "patch-level marker leaked into embedded: $m (policy: family only)"; bad_marker=1; FAIL=1
  fi
done
[ "$bad_marker" -eq 0 ] && ok "embedded markers track family v$family"

# 6) Secret-scan regression harness
echo "-- 6. secret-scan regression"
if [ -f tests/sim/check_secrets.sh ]; then
  [ -x tests/sim/check_secrets.sh ] || echo "WARN  tests/sim/check_secrets.sh lost its executable bit (common after zip/copy) — running via bash; restore with: chmod +x tests/sim/check_secrets.sh"
  if bash tests/sim/check_secrets.sh >/dev/null 2>&1; then ok "secret-scan harness green"; else bad "secret-scan harness RED"; fi
else
  bad "tests/sim/check_secrets.sh missing"
fi

# 7) TC ID third-slot vocabulary: every example TC-<MODULE>-<X>-... in the kit
#    must use a declared Layer Tag or Discipline Tag from ID_SCHEMES (v2.7.6)
echo "-- 7. TC id slot vocabulary"
LAYERS="FRONTEND_UI FRONTEND_STATE FRONTEND_CLIENT BFF API_GATEWAY MIDDLEWARE CONTROLLER SERVICE DOMAIN REPOSITORY INTEGRATION INFRASTRUCTURE SCHEDULER CLI SHARED_UTIL"
DISCIPLINES="SEC A11Y INT PERF I18N CHAOS"
slot_bad=0
while read -r id; do
  slot=$(echo "$id" | sed -E 's/^TC-(M_[A-Z0-9_]+|M[0-9]{2})-([A-Z0-9_]+)-.*/\2/')
  [ "$slot" = "$id" ] && continue   # didn't match full pattern (placeholder like TC-...)
  found=0
  for t in $LAYERS $DISCIPLINES; do [ "$slot" = "$t" ] && found=1 && break; done
  [ "$found" -eq 1 ] || { note "undeclared TC slot token: $slot in $id"; slot_bad=1; FAIL=1; }
done < <(grep -rhoE "TC-(M_[A-Z0-9_]+|M[0-9]{2})-[A-Z0-9_]+-[A-Z0-9_]+-[0-9]{3}" --include="*.md" references SKILL.md | sort -u)
[ "$slot_bad" -eq 0 ] && ok "all TC ids use declared Layer/Discipline tags" || bad "undeclared TC slot tokens above"

# 8) Template mandatory fields: every template carries the five universal
#    artifact fields from SKILL.md Output Discipline (rendered title-case)
echo "-- 8. template mandatory fields"
tpl_bad=0
for tpl in references/templates/TEMPLATE_*.md; do
  for fld in "Audience" "Priority" "Status" "Agent" "Linked IDs"; do
    grep -q "$fld" "$tpl" || { note "missing field '$fld' in $tpl"; tpl_bad=1; FAIL=1; }
  done
done
[ "$tpl_bad" -eq 0 ] && ok "all templates carry the 5 mandatory fields" || bad "template field gaps above"

# 9) File count: BY_THE_NUMBERS' declared total must match the kit on disk
#    (runtime dirs .git/.archive/.remember/.claude/.sisyphus excluded)
echo "-- 9. canonical file count"
kit_files=$(find . -type f \
  -not -path './.git/*' -not -path './.archive/*' -not -path './.remember/*' \
  -not -path './.claude/*' -not -path './.sisyphus/*' -not -name '.DS_Store' \
  | wc -l | tr -d ' ')
declared_files=$(grep -oE 'Total files \| [0-9]+' references/reference/BY_THE_NUMBERS.md | grep -oE '[0-9]+')
if [ -n "$declared_files" ] && [ "$kit_files" -eq "$declared_files" ]; then
  ok "kit file count = $kit_files (matches BY_THE_NUMBERS)"
else
  bad "kit file count = $kit_files but BY_THE_NUMBERS declares ${declared_files:-none}"
fi

# 10) Vocabulary residue: retired invocation-model terms must not reappear.
#     Multi-line aware (the v2.8 survivor wrapped across a line break).
#     CHANGELOG + archive excluded — history legitimately quotes old defects.
echo "-- 10. vocabulary residue"
res_bad=0
for f in SKILL.md $(find references -name '*.md'); do
  case "$f" in references/reference/CHANGELOG_ARCHIVE.md) continue;; esac
  if tr '\n' ' ' < "$f" | grep -qiE 'master[[:space:]]+prompt'; then
    note "master-prompt residue: $f"; res_bad=1; FAIL=1
  fi
done
[ "$res_bad" -eq 0 ] && ok "no retired-vocabulary residue" || bad "residue above"

echo "=="
if [ "$FAIL" -eq 0 ]; then echo "RESULT: CONSISTENT — safe to ship."; else echo "RESULT: INCONSISTENCIES — fix above before shipping."; fi
exit $FAIL
