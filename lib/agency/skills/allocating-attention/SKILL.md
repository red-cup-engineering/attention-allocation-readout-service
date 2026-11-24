---
name: allocating-attention
description: Chooses which obstructions to reconcile under a finite attention budget, exactly optimal for small candidate sets and within one item of optimal otherwise. Use when asked to choose which obstructions to reconcile under a finite attention budget, exactly optimal for small candidate sets and within one item of optimal otherwise.
---

# Allocating attention

A bounded agent faces many obstructions, each with a reconciliation cost and a benefit, and a finite budget spent once and never refunded (Obsmetrologia's Cohomology/AttentionAllocation.lean). Allocating attention reads the obstructions before an office (its open work items), prices each, and asks the attention-allocation operation which to take up next: the read-next order, the residual benefit left unreconciled, and how many equally good selections there were.
