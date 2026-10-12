import { put } from "@red-cup-engineering/semiotic-eavt-services-section/store";

/**
 * Provider-owned custody for this service's ActivityStreams evidence.
 * A category names the store type (`attention-allocation-readout-receipts`) and the record
 * payloads stay in the service contract; the store merely gives each admitted record durable,
 * content-addressed custody.
 */
export function createAttentionAllocationRecordJournal({ root }) {
  return Object.freeze({
    record({ category, record }) {
      return Object.freeze({ id: put(root, category, record) });
    },
  });
}
