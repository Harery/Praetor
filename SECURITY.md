# Security Policy

## Supported Versions

| Version | Supported |
|:---|:---|
| v2.8.x | ✅ Active |
| v2.7.x | ✅ Active |
| < v2.7 | ❌ End of life |

## Reporting a Vulnerability

We take security seriously — especially for a tool designed to audit production readiness.

**Preferred method:** Use [GitHub Security Advisories](https://github.com/Harery/Praetor/security/advisories/new) to report privately.

**Alternative:** If advisories are not accessible, open an issue titled `SECURITY: <brief summary>` with a high-level description. **Do not include exploit details, proof-of-concept code, or sensitive data in public issues.**

### What to include

- Affected file(s) or prompt component(s)
- Severity assessment (Critical / High / Medium / Low)
- Steps to reproduce or demonstrate the issue
- Suggested fix (optional)

### Response timeline

| Stage | Target |
|:---|:---|
| Acknowledgment | Within 48 hours |
| Initial assessment | Within 5 business days |
| Fix or mitigation plan | Within 14 business days |
| Public disclosure (if applicable) | After fix is released |

## Disclosure Policy

- **Coordinated disclosure** — we work with you to fix before any public disclosure
- **Credit** — we credit researchers in release notes unless you request anonymity
- **No legal action** against good-faith security research

## Scope

This policy covers:
- Prompt injection vulnerabilities in generated audit output
- Secret-key detection bypass patterns
- Compliance mapping errors that could lead to false audit evidence
- Any security-relevant defect in Praetor's prompt logic

Out of scope: vulnerabilities in third-party models (Claude, GPT, etc.), issues in your own codebase discovered by Praetor.
