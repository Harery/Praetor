# Why Praetor?

Modern software engineering moves at breakneck speeds, but auditing codebases for production readiness, operations, security, and compliance remains a slow, siloed, and error-prone process.

Traditional approaches fall into two categories, both of which have severe limitations:

1. **Manual Compliance and Audit Checklists**:
   * *Problem*: Takes weeks of developer and auditor time. Checklists become stale instantly. No direct coupling exists between the audit spreadsheet and the actual source code.
2. **Generic Single-Agent LLM Code Reviews**:
   * *Problem*: A single generic prompt lacks deep domain expertise across diverse disciplines (like WCAG accessibility, Prometheus metrics, and SOC2 access controls simultaneously). More importantly, single-agent models suffer from **hallucinations**, referencing functions, files, or vulnerabilities that do not exist.

---

## The Praetor Solution: Specialized Swarm & Gated QC

Praetor solves these challenges through a three-pronged architecture:

### 1. The Expert Swarm (18 Personas)
Instead of relying on a single generalist model, Praetor splits the audit workload among **18 specialized autonomous personas**. Each agent runs with a custom profile:
* **Years of Experience**: 10 to 20 years of simulated senior/staff expertise.
* **Defined Mandate**: Specific target areas (e.g., the Unit Test Agent only focuses on boundary conditions and mocked endpoints, while the Chaos Agent evaluates circuit breakers and timeouts).
* **Tooling Adaptation**: Automatic detection and syntax generation for your specific stack (e.g., emitting Datadog alerts if you use Datadog, Prometheus rules if you use Prometheus).

### 2. The 4-Judge Quality Council (QC)
All generated artifacts are submitted to the **Quality Council** before emission. If any artifact fails the quality gates, it is sent back to the originating agent with review feedback for regeneration.
* **Judge 1 (Coverage)**: Validates that all critical paths identified in technical discovery are mapped.
* **Judge 2 (Citations)**: Independently verify that every referenced file and line number exists and corresponds to the finding.
* **Judge 3 (Clarity)**: Evaluates readability, structure, and actionability of the output.
* **Judge 4 (Skip-Validity)**: Reviews any items deferred by agents to ensure they are genuinely out-of-scope or missing code.

### 3. Absolute Traceability
Every finding, risk, or test specification maps directly to source-code lines:
```markdown
Finding: Access control check is missing on endpoint `/api/v1/payments/refund`
Status: READY
Attribution: A06 (Security Agent)
Citation: prompt/04-mandates/SECRET_SCAN_MANDATE.md:L142-L148
```
This guarantees an audit evidence pack that human auditors, compliance officers, and SREs can immediately verify and trust.
