export type ItemStatus = "backlog" | "active" | "blocked" | "ready" | "done";

export type WorkItem = {
  id: string;
  title: string;
  category: string;
  owner: string;
  status: ItemStatus;
  priority: number;
  effort: number;
  friction: number;
  value: number;
  due: string;
  notes: string;
};

export type QualityCheck = {
  id: string;
  label: string;
  passed: boolean;
  weight: number;
};

export const sample: {
  repoName: string;
  title: string;
  subtitle: string;
  serviceLine: string;
  description: string;
  repositoryUrl: string;
  liveDemoUrl: string;
  theme: { accent: string; accent2: string; ink: string; soft: string; warm: string };
  items: WorkItem[];
  checks: QualityCheck[];
  deliverables: string[];
} = {
  "repoName": "foxhen-ai-proposal-studio",
  "title": "AI Proposal Studio",
  "subtitle": "proposal package",
  "serviceLine": "AI-assisted estimating",
  "description": "Convert rough job posts into scoped milestones, risk flags, estimates, and buyer-ready proposal notes.",
  "repositoryUrl": "https://github.com/foxandhenllc/foxhen-ai-proposal-studio",
  "liveDemoUrl": "https://foxhen-ai-proposal-studio.vercel.app",
  "theme": {
    "accent": "#48317d",
    "accent2": "#e8b86d",
    "ink": "#090816",
    "soft": "#f1edff",
    "warm": "#fff3dc"
  },
  "items": [
    {
      "id": "ai--1",
      "title": "Brief parser",
      "category": "Intake",
      "owner": "Chris",
      "status": "active",
      "priority": 5,
      "effort": 2,
      "friction": 1,
      "value": 5,
      "due": "Today",
      "notes": "Sample proposal package work item for ai-assisted estimating."
    },
    {
      "id": "ai--2",
      "title": "Scope card",
      "category": "Build",
      "owner": "Fox & Hen",
      "status": "backlog",
      "priority": 4,
      "effort": 4,
      "friction": 2,
      "value": 4,
      "due": "24h",
      "notes": "Sample proposal package work item for ai-assisted estimating."
    },
    {
      "id": "ai--3",
      "title": "Risk matrix",
      "category": "Review",
      "owner": "Buyer",
      "status": "blocked",
      "priority": 3,
      "effort": 3,
      "friction": 4,
      "value": 4,
      "due": "48h",
      "notes": "Sample proposal package work item for ai-assisted estimating."
    },
    {
      "id": "ai--4",
      "title": "Question list",
      "category": "Export",
      "owner": "Automation",
      "status": "ready",
      "priority": 4,
      "effort": 2,
      "friction": 2,
      "value": 3,
      "due": "This week",
      "notes": "Sample proposal package work item for ai-assisted estimating."
    },
    {
      "id": "ai--5",
      "title": "Estimate band",
      "category": "Intake",
      "owner": "QA",
      "status": "backlog",
      "priority": 2,
      "effort": 1,
      "friction": 1,
      "value": 3,
      "due": "Waiting",
      "notes": "Sample proposal package work item for ai-assisted estimating."
    },
    {
      "id": "ai--6",
      "title": "Proposal packet",
      "category": "Build",
      "owner": "Chris",
      "status": "done",
      "priority": 5,
      "effort": 5,
      "friction": 3,
      "value": 5,
      "due": "Next pass",
      "notes": "Sample proposal package work item for ai-assisted estimating."
    }
  ],
  "checks": [
    {
      "id": "payer",
      "label": "Payer or owner is clear",
      "passed": true,
      "weight": 18
    },
    {
      "id": "deliverable",
      "label": "Deliverable has acceptance criteria",
      "passed": true,
      "weight": 18
    },
    {
      "id": "friction",
      "label": "Account/access friction is documented",
      "passed": false,
      "weight": 14
    },
    {
      "id": "handoff",
      "label": "Handoff package is generated",
      "passed": false,
      "weight": 16
    },
    {
      "id": "reuse",
      "label": "Repeatable pipeline note exists",
      "passed": true,
      "weight": 12
    }
  ],
  "deliverables": [
    "Ranked board",
    "Editable item inspector",
    "Readiness checklist",
    "Exportable handoff report"
  ]
};
