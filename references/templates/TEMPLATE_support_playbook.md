<!-- Praetor — Production Readiness Audit Skill
     Copyright (c) 2026 Mohamed Elharery (https://github.com/Harery). All rights reserved.
     Project repository: https://github.com/Harery/Praetor
     Licensed under the MIT License; see LICENSE at the repository root. -->

# Template — Support Playbook `[SUP]`

## Triage Decision Tree (D.1)

```
SP-M_AUTH-LOGIN_ISSUES-001
Audience: [SUP]
Priority: P0
Status: READY
Agent: A14
Linked IDs: WF-001 (login), ERR-101 (invalid creds), ERR-102 (account locked)

Customer says: "I can't log into my account"

├─ Q1: Are you using the right email address?
│  ├─ Yes → continue
│  └─ Not sure → Ask them to check welcome email or invoice for the registered email
│
├─ Q2: Are you getting an error message? What does it say exactly?
│  ├─ "Invalid email or password" → Send password reset (D.3 → ERR-101)
│  │     └─ If still failing after reset → Q3
│  ├─ "Account locked" → See ERR-102 translation; unlock procedure
│  ├─ "Account suspended" → ESCALATE to billing (account state cheat sheet D.8)
│  └─ No error / spinner forever → Q4
│
├─ Q3: Is MFA enabled on the account?
│  ├─ Yes, lost access to MFA → ESCALATE to engineering (verification flow)
│  └─ No → ESCALATE engineering (unusual — RB-M_AUTH-LOGIN_FAILURE-001)
│
└─ Q4: Have you tried a different browser / cleared cache?
   ├─ Yes, still broken → ESCALATE engineering with repro steps (D.7)
   └─ No → Walk through; retry from Q2
```

## Error Translation (D.3)

```
SP-M_AUTH-ERROR_TRANSLATIONS-001
Audience: [SUP]
Priority: P0
Status: READY
Agent: A14
Linked IDs: ERR-101, ERR-102

| Error code | Plain meaning                                        | Most common cause       | Self-serve fix                    | When to escalate         |
| ERR-101    | "Email or password incorrect"                        | Mistyped password       | Password reset link               | After 3 reset attempts   |
| ERR-102    | "Account locked due to too many failed attempts"     | Brute-force protection  | Wait 15 min OR password reset     | If still locked after 30 min |
```

## Communication Template (D.4)

```
CT-M_AUTH-LOGIN_OUTAGE-001 — ACKNOWLEDGE
Audience: [SUP]
Priority: P0
Status: READY
Agent: A15
Linked IDs: WF-001 (login), ERR-101, UX-002 (status-page update)

"Hi [Customer Name], thanks for reaching out — we're aware of issues affecting
login right now and our engineering team is investigating. We'll update you
as soon as we have more information, typically within 30 minutes. Sorry for
the disruption."
```

## Conventions

- Plain language, no jargon.
- Decision trees are exhaustive — every branch leads either to a resolution
  or to an escalation, never a dead end.
- Comm templates are copy-paste-ready with named placeholders.
- Every escalation links back to an OPS runbook (RB-ID) so the handoff has
  context.
