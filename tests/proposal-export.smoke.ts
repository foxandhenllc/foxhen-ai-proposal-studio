import { sampleProposal } from "../src/data/proposalFixture.js";
import { exportPromptPackJson } from "../src/exporters/json.js";
import { exportClientProposalMarkdown } from "../src/exporters/markdown.js";
import {
  clearStoredProposalDraft,
  exportProposalProjectJson,
  parseProposalProjectJson,
  proposalProjectStorageKey,
  readStoredProposalDraft,
  type StorageAdapter,
  writeStoredProposalDraft,
} from "../src/lib/localProject.js";
import { buildProposalPackage } from "../src/lib/proposalEngine.js";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

const proposal = buildProposalPackage(sampleProposal);
const markdown = exportClientProposalMarkdown(proposal);
const promptPackJson = exportPromptPackJson(proposal);
const promptPack = JSON.parse(promptPackJson) as {
  projectTitle: string;
  clientName: string;
  prompts: Array<{ id: string; title: string; prompt: string }>;
  publicSafety: string[];
};

assert(proposal.clientName === "Brightside Dental Group", "fixture should keep client name");
assert(proposal.complexity.level === "Moderate", "fixture should score as moderate complexity");
assert(proposal.priceRange.low === 12000 && proposal.priceRange.high === 18000, "fixture should produce a 12k-18k range");
assert(markdown.startsWith("# AI Receptionist Scoping Proposal"), "markdown should start with the client title");
assert(markdown.includes("## Deliverables"), "markdown should include deliverables");
assert(markdown.includes("## Assumptions"), "markdown should include assumptions");
assert(markdown.includes("## Exclusions"), "markdown should include exclusions");
assert(markdown.includes("$12,000–$18,000"), "markdown should include formatted price range");
assert(promptPack.projectTitle === "AI Receptionist Scoping Proposal", "prompt pack should include proposal title");
assert(promptPack.clientName === "Brightside Dental Group", "prompt pack should include client name");
assert(promptPack.prompts.some((prompt) => prompt.id === "scope-risk-review"), "prompt pack should include risk review prompt");
assert(promptPack.publicSafety.includes("Use fictional or client-approved data only."), "prompt pack should include public-safe data guidance");

function createMemoryStorage(): StorageAdapter {
  const items = new Map<string, string>();

  return {
    getItem: (key) => items.get(key) ?? null,
    removeItem: (key) => {
      items.delete(key);
    },
    setItem: (key, value) => {
      items.set(key, value);
    },
  };
}

const editedDraft = {
  ...sampleProposal,
  intake: {
    ...sampleProposal.intake,
    clientName: "Local Browser Client",
  },
};
const projectJson = exportProposalProjectJson(editedDraft);
const importedProject = parseProposalProjectJson(projectJson);

assert(importedProject.intake.clientName === "Local Browser Client", "project JSON should restore edited draft fields");
assert(projectJson.includes("foxhen-ai-proposal-studio"), "project JSON should include an app marker");
assert(
  parseProposalProjectJson(JSON.stringify(editedDraft)).intake.projectTitle === sampleProposal.intake.projectTitle,
  "project JSON import should accept raw draft backups",
);

const storage = createMemoryStorage();
writeStoredProposalDraft(storage, editedDraft);
assert(storage.getItem(proposalProjectStorageKey)?.includes("Local Browser Client"), "local storage should keep the edited draft");
assert(readStoredProposalDraft(storage)?.intake.clientName === "Local Browser Client", "local storage should reload the edited draft");
clearStoredProposalDraft(storage);
assert(readStoredProposalDraft(storage) === null, "local storage reset should remove the saved draft");

let rejectedInvalidProject = false;
try {
  parseProposalProjectJson('{"not":"a proposal"}');
} catch {
  rejectedInvalidProject = true;
}
assert(rejectedInvalidProject, "project JSON import should reject invalid proposal files");

console.log("proposal export smoke test passed");
