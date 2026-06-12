<!-- Praetor — Production Readiness Audit Skill
     Copyright (c) 2026 Mohamed Elharery (https://github.com/Harery). All rights reserved.
     Project repository: https://github.com/Harery/Praetor
     Licensed under the MIT License; see LICENSE at the repository root. -->

# Test Fixtures Protocol

## The Problem This Solves

Generated tests often declare data pre-conditions in prose
("Test user alice@tenant_a.com exists") but don't provide seed scripts to
create them. Adds adoption friction: the team must reverse-engineer the
required state before any test can run.

## The Requirement

When any agent (A04, A05, A06, A07, A09, A11) emits a test that depends on
specific data state, the agent MUST also emit a corresponding **seed
fixture** that creates the required state. (A07's load scripts count: a
load test that assumes seeded accounts or catalog rows names its fixture
like any other test.)

## Format

Test artifact:
```
TC-M_ORDERS-CONTROLLER-PLACE-001
  Fixture: FX-M_ORDERS-USER_WITH_SKUS-001
  ...
```

Fixture artifact (emitted alongside test):
```
FX-M_ORDERS-USER_WITH_SKUS-001 [SETUP] READY
  Used by: TC-M_ORDERS-CONTROLLER-PLACE-001, TC-..., TC-...
  
  SQL (PostgreSQL):
  INSERT INTO tenants (id, name, plan) VALUES
    ('11111111-1111-1111-1111-111111111111', 'tenant_a', 'free');
  INSERT INTO users (id, tenant_id, email, password_hash, role) VALUES
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
     '11111111-1111-1111-1111-111111111111',
     'alice@tenant_a.com',
     '$2b$10$<bcrypt-hash-of-Passw0rd!>',
     'member');
  INSERT INTO skus (sku, tenant_id, name, price_cents, inventory_count) VALUES
    ('PEN-001', '11111111-1111-1111-1111-111111111111', 'Pen', 500, 100),
    ('PAD-001', '11111111-1111-1111-1111-111111111111', 'Pad', 1200, 50);
  INSERT INTO shipping_addresses (id, user_id, line1, city, country) VALUES
    ('aaaaaaaa-1111-1111-1111-aaaaaaaaaaaa',
     'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
     '123 Test St', 'Testville', 'US');
  
  Teardown SQL:
  DELETE FROM shipping_addresses WHERE id = 'aaaaaaaa-1111-1111-1111-aaaaaaaaaaaa';
  DELETE FROM skus WHERE tenant_id = '11111111-1111-1111-1111-111111111111';
  DELETE FROM users WHERE tenant_id = '11111111-1111-1111-1111-111111111111';
  DELETE FROM tenants WHERE id = '11111111-1111-1111-1111-111111111111';
```

## Fixture ID Scheme

```
FX-<MODULE>-<SCENARIO_NAME>-<NNN>
```

Where SCENARIO_NAME describes the data state created. Examples:
- `FX-M_ORDERS-USER_WITH_SKUS-001` — basic user + SKUs setup
- `FX-M_ORDERS-USER_AT_FREE_TIER_LIMIT-001` — user with 50 orders this month
- `FX-M_AUTH-LOCKED_USER-001` — user with 5 failed_logins entries

## Fixture Reuse

Multiple tests can share one fixture. The Coverage Ledger tracks which
tests use each fixture so deduplication works at the data level too.

## Blocked-Fixture Linkage (test status follows its fixture)

When a test's required fixture is itself blocked (e.g., the fixture is
`BLOCKED_BY_MISSING_SCHEMA` because the table doesn't exist yet), the test
does NOT invent a second, independent blocker. The test carries
`BLOCKED_BY_TEST_DATA` and its `Fixture:` line references the blocked fixture
ID, so a reader sees ONE root cause (missing schema) expressed as a
fixture-level blocker plus a test-level dependency — not two unrelated
problems. Rule:

- Fixture references absent schema → fixture = `BLOCKED_BY_MISSING_SCHEMA`.
- Any test whose only blocker is that fixture → test = `BLOCKED_BY_TEST_DATA`,
  with `BLOCKED_BY: FX-<id>` noted so the linkage is explicit.
- When the schema arrives, unblocking the fixture unblocks every linked test
  in one move; the Coverage Ledger already lists which tests use the fixture.

This keeps the test/fixture pair cohesive instead of surfacing as two separate
blocked items a reader has to mentally join.

## Fixture STATUS Tags

- `READY` — SQL is valid and idempotent (re-runnable without errors)
- `INFERRED` — fixture depends on inferred register entry (e.g., user
  confirmed retention is 30d but fixture inserts with that assumption)
- `BLOCKED_BY_MISSING_SCHEMA` — fixture references table/column not in
  migrations yet

## Format Adaptation (per A03)

Same idea as runbook adaptation:
- **PostgreSQL detected** → INSERT statements
- **MongoDB detected** → insertMany() shell commands
- **DynamoDB detected** → PutItem JSON
- **In-memory tests** → Jest beforeEach setup function
- **Multi-DB** → emit primary DB format + note for alternatives

## Owner

Each agent that emits a test also emits its required fixtures. The
Orchestrator deduplicates fixtures across modules via Coverage Ledger
(same fixture ID used by multiple tests → emit fixture once).

## Anti-Patterns Agents Refuse

- ❌ Tests that depend on production-grade data without a seed script
- ❌ Fixtures that aren't idempotent (can't run twice safely)
- ❌ Fixtures missing teardown
- ❌ Test pre-conditions that say "user exists" without specifying which user
- ❌ Hardcoded UUIDs that collide between fixtures

## Example Block in Test Output

```
TC-M_ORDERS-CONTROLLER-PLACE-001 [ENG] P0 READY A04
  Fixture: FX-M_ORDERS-USER_WITH_SKUS-001
  Pre-conditions:
    - Run fixture FX-M_ORDERS-USER_WITH_SKUS-001 (SQL provided below in fixture section)
    - Database in clean state
  Steps:
    1. Authenticate as alice@tenant_a.com (password 'Passw0rd!')
    2. POST /orders with body: {...}
    3. ...
```

This eliminates ambiguity in test pre-conditions.

## Phase 6 Wrap-Up Addition

The wrap-up now reports three numbers (note: fixtures are deduplicated at
emit via the Coverage Ledger, so the count of fixtures emitted IS the unique
count — there is no subtraction):
- Fixture references across tests: R (every `Fixture:` line on a test; R ≥ N)
- Distinct fixtures emitted: N (the actual setup work the team must build)
- Fixtures shared by 2+ tests: M (reuse visible in the Ledger's usage lists)
