import assert from "node:assert/strict";
import test from "node:test";
import { attentionAllocationOperations } from "../src/operations.mjs";
import { readAttentionWorkEvidence, replayAttentionWork } from "@red-cup-engineering/signcraft/attention-work";

const model = () => ({ budget: 10, obstructions: [
  { id: "a", cost: 6, benefit: 10 },
  { id: "b", cost: 5, benefit: 9 },
  { id: "c", cost: 5, benefit: 9 },
] });

test("the original scalar operation returns a native positive allocation", async () => {
  const operation = attentionAllocationOperations().find(op => op.verb === "attention-allocation");
  const result = await operation.execute(model());
  assert.deepEqual(result.readNext, ["b", "c"]);
  assert.equal(result.benefit, 18);
  assert.equal(result.cost, 10);
  assert.equal(result.residual, 10);
  assert.equal(result.exact, true);
  assert.equal(result.evidence.kind, "signcraft.attention-work-evidence/v1");
  assert.equal(replayAttentionWork(model(), result).admitted, true);
  assert.deepEqual(operation.effects, {
    class: "pure", replay: "safe", coordination: "coordination-free",
    deterministic: true, totality: "partial",
  });
});

test("the service factory retains a supplied host cap outside caller input", async () => {
  const allocationPolicy = { maxSearchNodes: 1, maxObstructions: 3 };
  const operations = attentionAllocationOperations({ allocationPolicy });
  allocationPolicy.maxSearchNodes = 1000;
  const operation = operations.find(op => op.verb === "attention-allocation");
  const input = { ...model(), maxSearchNodes: 1000 };
  const result = await operation.execute(input);
  assert.equal(result.exact, false);
  assert.deepEqual(result.readNext, ["a"]);
  assert.equal(result.benefit, 10);
  assert.equal(readAttentionWorkEvidence(result).claims.optimum.reading, "absurd");
  assert.equal(replayAttentionWork(input, result, {
    maxSearchNodes: 1, maxObstructions: 3,
  }).admitted, true);
  assert.throws(() => operation.execute({
    ...input, allocationPolicy: { maxSearchNodes: 1000, maxObstructions: 3 },
  }), /field/);
});

test("service setup uses original cheap policy admission", () => {
  assert.throws(() => attentionAllocationOperations({
    allocationPolicy: { maxSearchNodes: 1 },
  }), /host policy/);
});
