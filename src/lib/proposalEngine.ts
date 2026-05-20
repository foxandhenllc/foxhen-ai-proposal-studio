import type {
  ComplexityLevel,
  ComplexityScore,
  EstimateInputs,
  InternalEstimate,
  PriceRange,
  ProposalDraft,
  ProposalPackage,
  RiskSeverity,
} from "./proposalTypes.js";

const severityPoints: Record<RiskSeverity, number> = {
  Low: 1,
  Medium: 2,
  High: 3,
};

function roundToNearest(value: number, nearest: number) {
  return Math.round(value / nearest) * nearest;
}

function getComplexityLevel(total: number): ComplexityLevel {
  if (total <= 9) return "Low";
  if (total <= 16) return "Moderate";
  return "High";
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    currency: "USD",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(value);
}

export function formatCurrencyRange(range: PriceRange) {
  return `${formatCurrency(range.low)}–${formatCurrency(range.high)}`;
}

export function calculateComplexity(draft: ProposalDraft): ComplexityScore {
  const systemCount = draft.intake.systems.filter(Boolean).length;
  const deliverablePoints = Math.min(6, Math.ceil(draft.deliverables.length * 1.2));
  const integrationPoints = Math.min(5, systemCount);
  const riskPoints = draft.riskFlags.reduce((sum, risk) => sum + severityPoints[risk.severity], 0);
  const timeline = draft.intake.timelinePreference.toLowerCase();
  const timelinePoints = timeline.includes("rush") || timeline.includes("2 week") || timeline.includes("asap") ? 3 : 1;
  const total = Math.round(deliverablePoints + integrationPoints + riskPoints + timelinePoints);
  const highRiskCount = draft.riskFlags.filter((risk) => risk.severity === "High").length;
  const drivers = [
    `${draft.deliverables.length} client-facing deliverables`,
    `${systemCount} named system touchpoints`,
    `${draft.riskFlags.length} risk flags, including ${highRiskCount} high-severity item${highRiskCount === 1 ? "" : "s"}`,
    timelinePoints > 1 ? "compressed timeline pressure" : "standard discovery-to-delivery timeline",
  ];

  return {
    total,
    level: getComplexityLevel(total),
    drivers,
  };
}

export function calculatePriceRange(estimate: EstimateInputs): PriceRange {
  const totalHours = getTotalHours(estimate);
  const laborCost = totalHours * estimate.hourlyRate;
  const low = roundToNearest(laborCost, 500);
  const high = roundToNearest(laborCost * 1.5, 500);

  return {
    currency: "USD",
    low,
    high,
    label: `${formatCurrency(low)}–${formatCurrency(high)}`,
  };
}

export function getTotalHours(estimate: EstimateInputs) {
  return estimate.discoveryHours + estimate.implementationHours + estimate.qaHours + estimate.projectManagementHours;
}

export function calculateInternalEstimate(estimate: EstimateInputs): InternalEstimate {
  const totalHours = getTotalHours(estimate);
  const laborCost = totalHours * estimate.hourlyRate;
  const suggestedPrice = roundToNearest(laborCost * (1 + estimate.marginPercent / 100), 500);

  return {
    totalHours,
    laborCost,
    suggestedPrice,
    marginAmount: suggestedPrice - laborCost,
    hourlyRate: estimate.hourlyRate,
    notes: [
      `${estimate.discoveryHours}h discovery, ${estimate.implementationHours}h implementation, ${estimate.qaHours}h QA, ${estimate.projectManagementHours}h project management.`,
      `${estimate.marginPercent}% margin target is included in the internal suggested price, not the client-facing range.`,
    ],
  };
}

export function buildProposalPackage(draft: ProposalDraft): ProposalPackage {
  return {
    ...draft,
    clientName: draft.intake.clientName,
    complexity: calculateComplexity(draft),
    internalEstimate: calculateInternalEstimate(draft.estimate),
    priceRange: calculatePriceRange(draft.estimate),
    projectTitle: draft.intake.projectTitle,
  };
}
