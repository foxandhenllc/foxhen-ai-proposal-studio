import { formatCurrency, formatCurrencyRange } from "../lib/proposalEngine.js";
import type { ProposalPackage } from "../lib/proposalTypes.js";

function bulletList(items: string[]) {
  return items.map((item) => `- ${item}`).join("\n");
}

export function exportClientProposalMarkdown(proposal: ProposalPackage) {
  const { intake } = proposal;
  const deliverables = proposal.deliverables
    .map((deliverable) => {
      const criteria = deliverable.acceptanceCriteria.map((item) => `  - ${item}`).join("\n");
      return `- **${deliverable.title}:** ${deliverable.description}\n${criteria}`;
    })
    .join("\n");
  const timeline = proposal.timeline
    .map((phase) => `- **${phase.duration} — ${phase.title}:** ${phase.description} _Owner: ${phase.owner}_`)
    .join("\n");
  const risks = proposal.riskFlags
    .map((risk) => `- **${risk.label} (${risk.severity}):** ${risk.mitigation}`)
    .join("\n");

  return [
    `# ${intake.projectTitle}`,
    "",
    `Prepared for **${intake.clientName}** by **${proposal.brand.companyName}**.`,
    "",
    "## Brief",
    "",
    `**Industry:** ${intake.industry}`,
    "",
    `**Problem:** ${intake.problem}`,
    "",
    `**Goal:** ${intake.goal}`,
    "",
    `**Success metric:** ${intake.successMetric}`,
    "",
    "## Recommended Scope",
    "",
    `This is a ${proposal.complexity.level.toLowerCase()} complexity first-phase engagement with a recommended investment range of **${formatCurrencyRange(proposal.priceRange)}**.`,
    "",
    "## Deliverables",
    "",
    deliverables,
    "",
    "## Timeline",
    "",
    timeline,
    "",
    "## Assumptions",
    "",
    bulletList(proposal.assumptions),
    "",
    "## Exclusions",
    "",
    bulletList(proposal.exclusions),
    "",
    "## Risk Flags",
    "",
    risks,
    "",
    "## Client Decision Points",
    "",
    "- Confirm the sample-safe data sources for discovery.",
    "- Assign one decision owner for weekly scope approvals.",
    `- Decide whether the first paid phase should target ${formatCurrency(proposal.priceRange.low)} or expand toward ${formatCurrency(proposal.priceRange.high)} based on access timing.`,
  ].join("\n");
}
