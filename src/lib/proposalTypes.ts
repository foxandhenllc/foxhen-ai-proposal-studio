export type RiskSeverity = "Low" | "Medium" | "High";

export type ProposalBrand = {
  companyName: string;
  website: string;
  repositoryUrl: string;
  liveDemoUrl: string;
  accent: string;
  accent2: string;
  ink: string;
  soft: string;
  warm: string;
};

export type ProposalIntake = {
  projectTitle: string;
  clientName: string;
  industry: string;
  problem: string;
  goal: string;
  audience: string;
  currentWorkflow: string;
  systems: string[];
  budgetSignal: string;
  timelinePreference: string;
  successMetric: string;
};

export type ProposalDeliverable = {
  id: string;
  title: string;
  description: string;
  acceptanceCriteria: string[];
};

export type TimelinePhase = {
  id: string;
  title: string;
  duration: string;
  owner: string;
  description: string;
};

export type RiskFlag = {
  id: string;
  label: string;
  severity: RiskSeverity;
  mitigation: string;
};

export type EstimateInputs = {
  discoveryHours: number;
  implementationHours: number;
  qaHours: number;
  projectManagementHours: number;
  hourlyRate: number;
  marginPercent: number;
};

export type ProposalDraft = {
  brand: ProposalBrand;
  intake: ProposalIntake;
  assumptions: string[];
  exclusions: string[];
  deliverables: ProposalDeliverable[];
  timeline: TimelinePhase[];
  riskFlags: RiskFlag[];
  estimate: EstimateInputs;
  promptNotes: string[];
};

export type ComplexityLevel = "Low" | "Moderate" | "High";

export type ComplexityScore = {
  total: number;
  level: ComplexityLevel;
  drivers: string[];
};

export type PriceRange = {
  currency: "USD";
  low: number;
  high: number;
  label: string;
};

export type InternalEstimate = {
  totalHours: number;
  laborCost: number;
  suggestedPrice: number;
  marginAmount: number;
  hourlyRate: number;
  notes: string[];
};

export type ProposalPackage = ProposalDraft & {
  clientName: string;
  complexity: ComplexityScore;
  priceRange: PriceRange;
  projectTitle: string;
  internalEstimate: InternalEstimate;
};
