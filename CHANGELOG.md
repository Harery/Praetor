# Changelog

All notable changes to Praetor are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.5] - 2026-05-29

### Added
- **18 Expert Agent Personas** (A00 Orchestrator + A01–A17 specialists) with 12–20 year simulated domain expertise across SRE, OWASP Security, WCAG Accessibility, Chaos Engineering, SOC2/GDPR/HIPAA Compliance, and more
- **4-Judge Quality Council** with independent review for Coverage, Citations, Clarity, and Skip-Validity
- **7-Phase Execution Pipeline** — Source Resolution → Technical Discovery → Domain Mapping → MUST CONFIRM Gate → Agent Swarm → Quality Council → Release Gate
- **5 Audience Categories** — Engineering, Business, Operations, Support, and Compliance with tailored deliverable streams
- **12 Register Types** for traceability (Risk, Role, Workflow, etc.)
- **13 Inter-Agent Protocols** — citations, handoffs, conditional continue, resumable state, coverage ledger, artifact status, and more
- **11 ID Schemes** for cross-referencing artifacts
- **Tooling-Adaptive Output** — auto-detects Datadog, Prometheus, Sentry, etc. and emits artifacts in matching syntax
- **Secret Hygiene** — secret-key scanning with runnable secret-lint CI stage
- **Resumable Sessions** — `halt` emits compact snapshot for cross-session continuity
- **Self-Consistency CI** — `tools/check_consistency.sh` guards keep headline facts aligned across files
- **Claude Code Skill Package** (`Skill/praetor.skill`) — installable skill manifest for Claude Code integration
- **Getting Started Guide** (`prompt/GETTING_STARTED.md`) — step-by-step walkthrough for first-time users
- **Project Wiki** — extended documentation covering architecture, agents, quality council, and execution phases
- **Community Files** — `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, and GitHub issue/PR templates
- **Social Preview** — cyber-roman branded SVG for GitHub social cards
- **`llms.txt`** — AI agent discoverability index per [llmstxt.org](https://llmstxt.org) standard
- **GitHub Topics** — 20 curated tags for search discoverability
- **`praetor-audit-kit`** npm package — install via `npx praetor-audit-kit` with CLI welcome, prompt output, and path lookup
- **GitHub Release v2.5** — tagged release with downloadable prompt kit zip and Claude Code skill package

### Changed
- README rewritten with 2026 SEO optimization, modern visual hierarchy, scannable feature grid, collapsible sections, and inline navigation

### Security
- Built-in secret-key scanning (A06 Security Agent) with CI stage generation
- PII flow tracking across all compliance mappings

---

## [2.0] - Unreleased (Internal)

### Added
- Initial multi-agent orchestration framework
- File-line traceability discipline
- Quality Council review gates

### Changed
- Migrated from single-agent code review to hierarchical swarm architecture

---

[2.5]: https://github.com/Harery/Praetor/releases/tag/v2.5
