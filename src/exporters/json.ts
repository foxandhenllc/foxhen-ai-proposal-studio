import type { ProposalPackage } from "../lib/proposalTypes.js";

export type PromptPack = {
  schemaVersion: string;
  projectTitle: string;
  clientName: string;
  publicSafety: string[];
  sourceInputs: {
    intakeSummary: string;
    systems: string[];
    assumptions: string[];
    exclusions: string[];
    riskFlags: Array<{ label: string; severity: string; mitigation: string }>;
    complexity: ProposalPackage["complexity"];
    priceRange: ProposalPackage["priceRange"];
  };
  prompts: Array<{ id: string; title: string; prompt: string }>;
};

export function buildPromptPack(proposal: ProposalPackage): PromptPack {
  const { intake } = proposal;
  const publicSafety = [
    "Use fictional or client-approved data only.",
    "Do not include credentials, secrets, PHI, private contacts, or production records.",
    "Do not call live models, backends, or external services from this static v1.",
  ];

  return {
    schemaVersion: "proposal-prompt-pack.v1",
    projectTitle: intake.projectTitle,
    clientName: intake.clientName,
    publicSafety,
    sourceInputs: {
      intakeSummary: `${intake.problem} Goal: ${intake.goal}`,
      systems: intake.systems,
      assumptions: proposal.assumptions,
      exclusions: proposal.exclusions,
      riskFlags: proposal.riskFlags.map(({ label, severity, mitigation }) => ({ label, severity, mitigation })),
      complexity: proposal.complexity,
      priceRange: proposal.priceRange,
    },
    prompts: [
      {
        id: "scope-summarizer",
        title: "Scope summary prompt",
        prompt: `Summarize the proposed ${intake.industry} engagement for ${intake.clientName}. Use only the provided fictional or client-approved facts. Highlight problem, goal, audience, systems, and success metric.`,
      },
      {
        id: "scope-risk-review",
        title: "Risk review prompt",
        prompt: `Review these risk flags and mitigations for the ${intake.projectTitle}. Identify missing client decisions, public-safe data concerns, and timeline dependencies without inventing facts.`,
      },
      {
        id: "client-proposal-polish",
        title: "Client proposal polish prompt",
        prompt: "Rewrite the proposal in plain client-friendly language. Preserve assumptions, exclusions, timeline, deliverables, investment range, and public-safe constraints exactly.",
      },
      {
        id: "internal-estimate-check",
        title: "Internal estimate check prompt",
        prompt: "Check whether the hours, margin, complexity drivers, and risk flags support the proposed range. Keep internal cost details out of any client-facing response.",
      },
    ],
  };
}

export function exportPromptPackJson(proposal: ProposalPackage) {
  return JSON.stringify(buildPromptPack(proposal), null, 2);
}

export function exportProposalSnapshotJson(proposal: ProposalPackage) {
  return JSON.stringify(
    {
      schemaVersion: "proposal-snapshot.v1",
      publicSafety: [
        "Fictional sample data only.",
        "No backend, auth, secrets, real contacts, production records, or live model calls.",
      ],
      proposal,
    },
    null,
    2,
  );
}
