#!/usr/bin/env node
/**
 * Source-owned local attention readout. This is a PURE exploration surface
 * for the same two operations exposed through the contract/host protocol.
 * It cannot accept an organizational contract, allocate Work, or mutate data.
 */
import { fileURLToPath } from "node:url";
import { realpathSync } from "node:fs";
import { resolve } from "node:path";
import { attentionAllocationOperations } from "./operations.mjs";

const kinds = Object.freeze({
  allocate: "attention-allocation",
  "work-placement": "attention-work-placement",
});

export async function readAttentionLocally({ mode = "allocate", input }) {
  const name = kinds[mode];
  if (!name) throw new TypeError("Unknown attention mode: " + mode);
  const operation = attentionAllocationOperations().find(entry => entry.verb === name);
  if (!operation) throw new TypeError("Original attention operation is unavailable: " + name);
  const result = await operation.execute(input);
  return Object.freeze({
    kind: "attention.local-source-readout.v1",
    operation: name,
    input,
    result,
    effect: "read-only; no Work assignment, contract acceptance, execution or settlement",
    authority: "none inferred from selecting or scoring candidates",
  });
}

export function attentionCapabilities() {
  return Object.freeze(attentionAllocationOperations().map(op => Object.freeze({
    verb: op.verb,
    summary: op.summary,
    description: op.description,
    effects: op.effects ?? null,
    inputFormat: op.inputFormat,
    outputFormat: op.outputFormat,
  })));
}

const example = Object.freeze({
  budget: 5,
  obstructions: [
    { id: "understand-the-interface", cost: 2, benefit: 5 },
    { id: "trace-a-receipt", cost: 3, benefit: 6 },
    { id: "rework-the-entire-platform", cost: 5, benefit: 9 },
  ],
});
const help = `attention-plan [--operations | --example | --run-example | --work-placement] < request.json
Default: read a {budget, obstructions:[{id,cost,benefit}]} allocation and return the
original metrologic selected/unselected allocation, residual and tie evidence.
--operations   observe both actual, independently callable operation contracts
--example      emit an explicitly illustrative problem as reusable JSON input
--run-example  execute that problem using the original mathematical operator
--work-placement  read a TypedWorkDemand problem through the original
               denomination-aware work placement operation (no Work effects)
All budgets and benefits come from the caller or illustrative example; this
command never measures economic value or chooses resource costs for you.
The separately governed solicit-service/invoke-service protocol is unchanged.
`;

async function readStdin(stream = process.stdin) {
  let raw = "";
  stream.setEncoding("utf8");
  for await (const chunk of stream) raw += chunk;
  if (!raw.trim()) throw new TypeError("Provide one JSON attention problem on stdin; see --example");
  return JSON.parse(raw);
}

export async function main(args = process.argv.slice(2), {
  output = process.stdout,
  stdin = process.stdin,
} = {}) {
  if (args.length > 1) throw new TypeError(help);
  const arg = args[0];
  if (["--help", "-h", "help"].includes(arg)) { output.write(help); return 0; }
  if (arg === "--operations") { output.write(JSON.stringify(attentionCapabilities(), null, 2) + "\n"); return 0; }
  if (arg === "--example") { output.write(JSON.stringify(example, null, 2) + "\n"); return 0; }
  const mode = arg === "--work-placement" ? "work-placement" : "allocate";
  if (arg !== undefined && !["--run-example", "--work-placement"].includes(arg))
    throw new TypeError(help);
  const input = arg === "--run-example" ? example : await readStdin(stdin);
  const observed = await readAttentionLocally({ mode, input });
  output.write(JSON.stringify(observed, null, 2) + "\n");
  return 0;
}

if (process.argv[1] && realpathSync(resolve(process.argv[1])) === realpathSync(fileURLToPath(import.meta.url))) {
  main().then(value => { process.exitCode = value; }).catch(error => {
    process.stderr.write("attention-plan: " + error.message + "\n");
    process.exitCode = 1;
  });
}
