# Welcome to the Praetor Wiki

**Praetor** is an autonomous multi-agent orchestration framework designed to audit codebases and generate production-readiness packages.

By utilizing **18 autonomous expert agents** under the strict review of a **4-Judge Quality Council**, Praetor scans repository sources to compile security, SRE runbooks, test specifications, business validation matrices, and compliance control maps (SOC2, GDPR, HIPAA)—all with **100% verified source-code citations (`file:line`)**.

---

## 📦 Installation

| Method | Command / Link | Notes |
|:---|:---|:---|
| **npm** | `npx praetor-audit-kit` | |
| **Install to tools** | `npx praetor-audit-kit --install` | Claude Code, OpenCode, Cursor |
| **GitHub Release** | [Download v2.9.1](https://github.com/Harery/Praetor/releases/tag/v2.9.1) | |
| **Scope selection** | `npx praetor-audit-kit --scope biz` | Number, alias, or range |
| **Uninstall** | `npx praetor-audit-kit --uninstall` | Removes from all tools |
| **Direct** | Copy `prompt/00-orchestrator/MASTER_PROMPT.md` into your LLM context | |

---

## 📖 Wiki Table of Contents

### 1. Introduction
* **[[Why Praetor?|Why-Praetor]]**: Learn why traditional static code review tools and generic single-agent LLM reviews fail compared to a specialized multi-agent swarm.
* **[[Quick Start Guide|Quick-Start-Guide]]**: Get Praetor running on your codebase in less than 2 minutes.

### 2. Core Swarm Architecture
* **[[The 18 Expert Agents|The-18-Expert-Agents]]**: Meet the specialized personas (DevOps, Security, WCAG, Chaos, SRE) that audit your codebase.
* **[[The 4-Judge Quality Council|The-4-Judge-Quality-Council]]**: Understand the zero-hallucination engine that validates all generated findings and citations.
* **[[The 7 Execution Phases|The-7-Execution-Phases]]**: Walk through the automated pipeline from source resolution to final gate delivery.

### 3. Deliverables & Streams
* **[[Engineering & QA Suite|Engineering-and-QA-Suite]]**: Integration, performance, security, and chaos test specifications.
* **[[Operations & SRE Runbooks|Operations-and-SRE-Runbooks]]**: Multi-platform alert definitions (Datadog/Prometheus) and 3:00 AM incident runbooks.
* **[[Compliance & Security Evidence|Compliance-and-Security-Evidence]]**: Access control matrices, PII flow logs, and control mappings (SOC2/GDPR/HIPAA).
* **[[Business & CX Support|Business-and-CX-Support]]**: Product verification matrices, User Acceptance Test (UAT) scripts, and customer triage playbooks.

### 4. Advanced Usage
* **[[Priority Rubrics & Overrides|Priority-Rubrics-and-Overrides]]**: Customize the execution scope, target modules, or priority levels.
* **[[Citation Verification Protocol|Citation-Verification-Protocol]]**: Deep dive into how Praetor guarantees all references map to real file-line configurations.
