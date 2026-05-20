import { sampleProposal } from "../src/data/proposalFixture.js";
import { exportPromptPackJson } from "../src/exporters/json.js";
import { exportClientProposalMarkdown } from "../src/exporters/markdown.js";
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

console.log("proposal export smoke test passed");
