/**
 * The attention allocation as an operation family: an incumbent with obstructions before it and a
 * finite budget reads which to reconcile next (metrologic's attention allocation, from
 * Obsmetrologia's Cohomology/AttentionAllocation.lean).
 */
import { operation } from "@red-cup-engineering/computer-system-engine/rpc/operation";
import { admitAttentionWork, computeAttentionWork } from "@red-cup-engineering/signcraft/attention-work";
import { decideAttentionWorkPlacement } from "@red-cup-engineering/computer-inference-engine/dispatch/work-placement";

export function attentionAllocationOperations({ allocationPolicy } = {}) {
  // The provider supplies this policy outside the mathematical request body.
  admitAttentionWork({ budget: 0, obstructions: [] }, allocationPolicy);
  const suppliedPolicy = allocationPolicy === undefined ? undefined : Object.freeze({ ...allocationPolicy });
  return Object.freeze([
    operation({
      verb: "attention-allocation",
      inputFormat: "json",
      outputFormat: "json",
      summary: "Choose which obstructions to reconcile under a finite attention budget.",
      description: "Domain: { obstructions: [{ id, cost, benefit }], budget, maxSearchNodes? } with unique string identities, nonnegative safe-integer costs, benefits and budget, and exactly representable aggregate benefit. Maximizes captured benefit subject to the budget; completed search retains the original tail-first input-position tie convention. Returns the original AttentionAllocation and native source/result tellings. Interrupted search retains a feasible incumbent without a general approximation ratio or optimum claim. Costs and benefits are caller-supplied abstract counts; actual reconciliation and user acceptance remain untold.",
      effects: { class: "pure", replay: "safe", coordination: "coordination-free", deterministic: true, totality: "partial" },
      run: (input) => computeAttentionWork(input, suppliedPolicy),
    }),
    operation({
      verb: "attention-work-placement",
      inputFormat: "json",
      outputFormat: "json",
      summary: "Read which measured, independently placeable work fits one explicit attention budget.",
      description: "Admits TypedWorkDemand candidates through the existing denomination-aware Pareto placement law, retaining receiver-observation evidence and choice-required/refused decisions. Allocates a named natural-count attention budget over disjoint held obstruction identities, preserving exact/approximate and handed tie semantics. This readout performs no work, reserves no shared quota, and claims no observed removal or asset settlement.",
      effects: { class: "pure", replay: "safe", coordination: "coordination-free", deterministic: true, totality: "partial" },
      run: (input) => decideAttentionWorkPlacement(input),
    }),
  ]);
}
