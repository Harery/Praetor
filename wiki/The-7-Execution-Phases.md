# The 7 Execution Phases

Praetor processes codebases through a structured, linear pipeline of 7 distinct execution phases. This structured progression ensures that the initial code understanding is solid before specialized audits and Quality Council reviews begin.

---

## 📅 Phases Overview

```
Phase 0 ──► Phase 1 ──► Phase 2 ──► Phase 3 (MUST CONFIRM) ──► Phase 4 (Swarm) ──► Phase 5 (QC) ──► Phase 6 (Wrap-up)
```

---

## 🏛️ Deep Dive into the Pipeline

### Phase 0: Source Resolution
* **Goal**: Prepare codebase entry points.
* **Details**: Unpacks the repository sources, resolves submodule structures, filters out irrelevant files (like compiled binaries, static icons, or package lockfiles), and prepares a clean, text-only source-code cache.

### Phase 1: Technical Discovery
* **Goal**: Auto-detect tech stack, architecture, and configurations.
* **Details**: Scans config files, dependencies, and imports to detect:
  * Languages, databases, and core framework libraries.
  * Logging platforms (Winston, Sentry, Logback).
  * Observability platforms (Datadog, Prometheus, NewRelic).
  * Deployment and environment environments (Docker, Kubernetes).

### Phase 2: Domain Mapping
* **Goal**: Construct logical boundaries.
* **Details**: Performs Domain-Driven Design (DDD) scans, grouping files into domain services, bounding contexts, and data flow layers. This serves as the blueprint that Judge 1 (Coverage) will use to audit agent output completeness.

### Phase 3: Discovery Report & Gate (MUST CONFIRM)
* **Goal**: Validate and override parameters before swarming.
* **Details**: The system pauses and outputs a structured **Discovery Report** detailing all detected tools, scopes, and parameters. The user must provide a confirmation block (e.g., using `CONDITIONAL_CONTINUE` protocol) containing:
  * Answers to key discovery questions (e.g., *Is WCAG compliance required?*).
  * Run mode overrides (e.g., limiting audits to specific directories or high-priority items only).

### Phase 4: Agent Swarm Analysis
* **Goal**: Dispersed parallel analysis.
* **Details**: Dispatches the specialized Tier 2, Tier 3, and Tier 4 agents (Security, Perf, SRE, Compliance) to execute their mandates. The agents write their findings in custom formats matching the target frameworks detected during Phase 1.

### Phase 5: Quality Council Audit
* **Goal**: Eliminate hallucinations and guarantee citation accuracy.
* **Details**: The 4-Judge Quality Council audits all agent outputs. Any failed spec is sent back to the respective agent for regeneration with inline feedback.

### Phase 6: Wrap-up & Release Gate Delivery
* **Goal**: Consolidate and package results.
* **Details**: Integrates all passed deliverables into structured folders organized by target audience. It generates the **Unified Risk Register** (remediation times, owners, priority levels) and the **Main Release Gate** checklist shell hook to prevent regressions.
