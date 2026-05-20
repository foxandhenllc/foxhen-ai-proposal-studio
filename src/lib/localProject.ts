import type {
  EstimateInputs,
  ProposalBrand,
  ProposalDeliverable,
  ProposalDraft,
  ProposalIntake,
  RiskFlag,
  RiskSeverity,
  TimelinePhase,
} from "./proposalTypes.js";

export type StorageAdapter = Pick<Storage, "getItem" | "removeItem" | "setItem">;

export const proposalProjectStorageKey = "foxhen-ai-proposal-studio.project.v1";

const proposalProjectApp = "foxhen-ai-proposal-studio";
const proposalProjectSchemaVersion = "foxhen-ai-proposal-studio.project.v1";
const riskSeverities: RiskSeverity[] = ["Low", "Medium", "High"];

type ProposalProjectFile = {
  app: typeof proposalProjectApp;
  schemaVersion: typeof proposalProjectSchemaVersion;
  exportedAt: string;
  draft: ProposalDraft;
};

function cloneDraft(draft: ProposalDraft): ProposalDraft {
  return JSON.parse(JSON.stringify(draft)) as ProposalDraft;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isProposalBrand(value: unknown): value is ProposalBrand {
  return (
    isRecord(value) &&
    typeof value.companyName === "string" &&
    typeof value.website === "string" &&
    typeof value.repositoryUrl === "string" &&
    typeof value.liveDemoUrl === "string" &&
    typeof value.accent === "string" &&
    typeof value.accent2 === "string" &&
    typeof value.ink === "string" &&
    typeof value.soft === "string" &&
    typeof value.warm === "string"
  );
}

function isProposalIntake(value: unknown): value is ProposalIntake {
  return (
    isRecord(value) &&
    typeof value.projectTitle === "string" &&
    typeof value.clientName === "string" &&
    typeof value.industry === "string" &&
    typeof value.problem === "string" &&
    typeof value.goal === "string" &&
    typeof value.audience === "string" &&
    typeof value.currentWorkflow === "string" &&
    isStringArray(value.systems) &&
    typeof value.budgetSignal === "string" &&
    typeof value.timelinePreference === "string" &&
    typeof value.successMetric === "string"
  );
}

function isProposalDeliverable(value: unknown): value is ProposalDeliverable {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.title === "string" &&
    typeof value.description === "string" &&
    isStringArray(value.acceptanceCriteria)
  );
}

function isTimelinePhase(value: unknown): value is TimelinePhase {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.title === "string" &&
    typeof value.duration === "string" &&
    typeof value.owner === "string" &&
    typeof value.description === "string"
  );
}

function isRiskFlag(value: unknown): value is RiskFlag {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.label === "string" &&
    riskSeverities.includes(value.severity as RiskSeverity) &&
    typeof value.mitigation === "string"
  );
}

function isEstimateInputs(value: unknown): value is EstimateInputs {
  return (
    isRecord(value) &&
    typeof value.discoveryHours === "number" &&
    typeof value.implementationHours === "number" &&
    typeof value.qaHours === "number" &&
    typeof value.projectManagementHours === "number" &&
    typeof value.hourlyRate === "number" &&
    typeof value.marginPercent === "number"
  );
}

function isProposalDraft(value: unknown): value is ProposalDraft {
  return (
    isRecord(value) &&
    isProposalBrand(value.brand) &&
    isProposalIntake(value.intake) &&
    isStringArray(value.assumptions) &&
    isStringArray(value.exclusions) &&
    Array.isArray(value.deliverables) &&
    value.deliverables.every(isProposalDeliverable) &&
    Array.isArray(value.timeline) &&
    value.timeline.every(isTimelinePhase) &&
    Array.isArray(value.riskFlags) &&
    value.riskFlags.every(isRiskFlag) &&
    isEstimateInputs(value.estimate) &&
    isStringArray(value.promptNotes)
  );
}

function extractDraft(value: unknown): ProposalDraft | null {
  if (isProposalDraft(value)) {
    return value;
  }

  if (isRecord(value)) {
    if (isProposalDraft(value.draft)) {
      return value.draft;
    }
    if (isProposalDraft(value.proposal)) {
      return value.proposal;
    }
  }

  return null;
}

export function cloneProposalDraft(draft: ProposalDraft): ProposalDraft {
  return cloneDraft(draft);
}

export function exportProposalProjectJson(draft: ProposalDraft) {
  const projectFile: ProposalProjectFile = {
    app: proposalProjectApp,
    schemaVersion: proposalProjectSchemaVersion,
    exportedAt: new Date().toISOString(),
    draft: cloneDraft(draft),
  };

  return JSON.stringify(projectFile, null, 2);
}

export function parseProposalProjectJson(jsonText: string): ProposalDraft {
  let parsed: unknown;

  try {
    parsed = JSON.parse(jsonText);
  } catch {
    throw new Error("Proposal project JSON could not be parsed.");
  }

  const draft = extractDraft(parsed);
  if (!draft) {
    throw new Error("Proposal project JSON must include a valid proposal draft.");
  }

  return cloneDraft(draft);
}

export function getBrowserStorage(): StorageAdapter | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function readStoredProposalDraft(storage: StorageAdapter): ProposalDraft | null {
  const savedProject = storage.getItem(proposalProjectStorageKey);
  return savedProject ? parseProposalProjectJson(savedProject) : null;
}

export function writeStoredProposalDraft(storage: StorageAdapter, draft: ProposalDraft) {
  storage.setItem(proposalProjectStorageKey, exportProposalProjectJson(draft));
}

export function clearStoredProposalDraft(storage: StorageAdapter) {
  storage.removeItem(proposalProjectStorageKey);
}
