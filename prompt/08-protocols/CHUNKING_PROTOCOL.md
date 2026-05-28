# Chunking Protocol

## Core Rule

When module output would exceed token budget, the Orchestrator MUST chunk
the response across category boundaries. The Orchestrator MUST NOT:
- Abbreviate any agent's output ("...summarized for readability")
- Skip agents that activated ("A10 covered but not shown")
- Truncate the Citations Index
- Skip the Quality Council notes
- Compress full artifacts into table rows

If you find yourself wanting to abbreviate, that's the signal to chunk
instead.

## When to Chunk

Module output approaching token budget. Heuristic: if combined output of all
agents for a module would exceed ~6000 tokens, chunk.

## How to Chunk

1. Complete one or more entire categories (A, B, C, D, E).
2. Stop at a category boundary. Never split a category mid-table.
3. Emit partial marker:
   ```
   --- MODULE M_X PARTIAL (categories A,B done; C,D,E pending) — reply 'continue module' ---
   ```
4. On `continue module`, resume from next pending category.
5. Repeat until all categories complete.
6. Then emit module Citations Index + standard end marker:
   ```
   --- END MODULE M_X (n of N) — reply 'continue' for next module ---
   ```

## What NOT to Do

- ❌ Split a table across responses
- ❌ Emit half a runbook
- ❌ Skip the Citations Index because of length pressure

## Coordination With Orchestrator

The Orchestrator decides chunking. Agents always emit their full scope; the
Orchestrator decides what to package into each response.
