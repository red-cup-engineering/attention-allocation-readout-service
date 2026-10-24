# Attention Allocation — Choosing What to Address Next

<!-- 561-group-standards:badges:start -->
[![Red Cup Engineering](https://img.shields.io/badge/561%20Group-Red%20Cup%20Engineering-c0392b)](https://github.com/red-cup-engineering)
[![License: MIT](https://img.shields.io/badge/license-MIT-c0392b)](LICENSE)
[![Indigenous data: CARE](https://img.shields.io/badge/Indigenous%20data-CARE-4b6f44)](https://github.com/red-cup-engineering/.github/blob/main/GOVERNANCE.md)
[![Tips welcome](https://img.shields.io/badge/tips-welcome-d4a017)](https://github.com/561-group/.github/blob/main/TIPS.md)
<!-- 561-group-standards:badges:end -->

**Given more obstructions than you can afford to resolve, this technology
chooses a bounded set to attend to.** Each obstruction has an explicit
identifier, cost, and benefit; an attention budget limits how many can be
reconciled. The underlying mathematics comes from
the source-owned `@red-cup-engineering/metrologic` dependency
and the Group's Obsmetrologia research. This repository provides an
executable readout and a separately governed service contract.

It is **not** a project manager, a work executor, or an AI that assigns its
own importance scores. The caller supplies costs, benefits, authority and
evidence; the algorithm cannot determine which goals are valuable.

## Actually use it

The source repository now defines a pure `attention-plan` executable.
The following is a **checkout** workflow using its maintained code and
declared dependencies, not an assertion that the new CLI is already
published in the registry:

```sh
npm install --ignore-scripts
node src/attention-plan.mjs --example
node src/attention-plan.mjs --run-example
node src/attention-plan.mjs --operations
node src/attention-plan.mjs --example | node src/attention-plan.mjs
```

The package also declares an `attention-plan` bin for distribution. A
separate packed-artifact consumer check qualifies that entry point;
whether a given registry release includes these changes must be verified
against the registry itself. A source merge is not a publication receipt.

A call can also read a real, caller-authored JSON problem:

```json
{
  "budget": 5,
  "obstructions": [
    { "id": "understand-the-interface", "cost": 2, "benefit": 5 },
    { "id": "trace-a-receipt", "cost": 3, "benefit": 6 },
    { "id": "rework-the-entire-platform", "cost": 5, "benefit": 9 }
  ]
}
```

In this **illustrative** problem, the first two interventions fit the budget
and yield combined declared benefit 11, while the third alone yields 9.
The program returns the *actual Metrologic allocation carrier*, including
the selection, remaining benefit, exact/approximate status, and
tie ambiguity. It does not claim these example costs or benefits were
measured or received from real developers.

## Two related technologies, one source

| Operation | When to use it | What it does not do |
| --- | --- | --- |
| `attention-allocation` | Your obstacles have compatible finite budgets, costs, and benefits | Determine whether estimates are true or carry out the selected work |
| `attention-work-placement` | You have typed Work demand, source evidence and an explicitly denominated capacity budget | Invent exchange rates, dispatch agents, reserve capacity, or certify work completion |

The second operation is available through the same CLI:

```sh
attention-plan --work-placement < work-demand.json
```

It invokes the original
[`attentionAllocationOperations`](src/operations.mjs)
`attention-work-placement` entry and retains its explicit placement and
refusal outcomes. It does not create a second optimizer or an implicit
conversion between denominations.

## How this relates to an operating agent

The CLI imports the [original operation family](src/operations.mjs) and
uses its native `execute` function. It creates **no** Work records, never
calls a provider, changes no budget, and asks for no authority grant.
It is suitable for understanding and locally exploring the actual math
before incorporating it into a larger system.

The package's existing
[`solicit-service` / `invoke-service` boundary](src/contract-attention-allocation.mjs)
is different: it uses source-addressed ActivityStreams offers, terms
acceptance, attenuated capabilities, execution receipts and a local semantic
record journal. That is the authorized service path for contract-bound use.
The new `attention-plan` is deliberately **not** an alternative way
to accept or execute a contract.

For JavaScript callers, the package exports
`@red-cup-engineering/attention-allocation-readout-service/operations`
and `./local-readout`. The latter provides `readAttentionLocally`,
`attentionCapabilities`, and the pure entry's CLI helper; no independent
source of mathematical truth is added.

## What it can substantiate

An executed readout can support *which selection follows from the supplied
premises*, its budget, unselected benefit and ties. It does not establish
that the premises were measured correctly, that selected work was performed,
that a receiver accepted it, or that any economic settlement happened.
Those are distinct operations with their own owners and evidence.
