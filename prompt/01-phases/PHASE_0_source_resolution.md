# Phase 0 — Source Resolution

**Wall-clock**: 5 minutes. **Owner**: Orchestrator A00 (no specialist agent spawned).

Resolution priority: GitHub → local path → uploads → in-context → HALT.

Records: SOURCE_TYPE, SOURCE_ROOT, and a SNAPSHOT_TOKEN. The token is:
- a git commit SHA when the source is a git repo (GitHub or local with `.git`),
- the upload date when the source is an uploaded archive,
- a content fingerprint (file count + total bytes + newest mtime, e.g.
  `local:8f/1240KB/2026-06-10`; when a shell is available, append a SHA-256 of
  the sorted path+size manifest, e.g. `local:8f/1240KB/2026-06-10/a3f9…`) when
  the source is a local non-git directory or in-context paste with no SHA and
  no upload date.

The SNAPSHOT_TOKEN is never empty — every source type yields one of the three
forms above, so `SNAPSHOT_DRIFT` detection on resume always has something to
compare.

## v2 Note

Phase 0 records the SNAPSHOT_TOKEN (commit SHA, upload date, or content
fingerprint — see above) so a Resumable Snapshot
(`08-protocols\/RESUMABLE_STATE.md`) can detect `SNAPSHOT_DRIFT` on
resume regardless of source type. If no source resolves, HALT per
`99-reference\/FAILURE_RULES.md` §1 — never invent a source.
