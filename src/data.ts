export const sample = {
  "repoName": "foxhen-ai-proposal-studio",
  "title": "AI Proposal Studio",
  "subtitle": "Scope, price, and package work faster",
  "serviceLine": "AI-assisted estimating",
  "heroTitle": "Turn a rough job post into a scoped proposal package.",
  "heroCopy": "A simulated proposal desk that extracts requirements, flags risk, builds milestones, and produces an estimate that is ready for a human final pass.",
  "primaryAction": "Generate scope",
  "secondaryAction": "Review risks",
  "repositoryUrl": "https://github.com/foxandhenllc/foxhen-ai-proposal-studio",
  "liveDemoUrl": "https://foxhen-ai-proposal-studio.vercel.app",
  "theme": {
    "accent": "#3a2d73",
    "accent2": "#e7b86d",
    "ink": "#090816",
    "soft": "#f0eefc",
    "warm": "#fff3da",
    "surface": "#fffaf4",
    "muted": "#5c667a",
    "border": "rgba(7, 18, 31, 0.12)"
  },
  "metrics": [
    {
      "label": "Scope confidence",
      "value": "89%",
      "note": "+34 pts"
    },
    {
      "label": "Estimate band",
      "value": "$450-$900",
      "note": "fixed-fee ready"
    },
    {
      "label": "Risk flags",
      "value": "5",
      "note": "2 require approval"
    }
  ],
  "stages": [
    {
      "label": "Parse brief",
      "detail": "Extract buyer goal, required deliverable, deadline, and evidence needed before quoting.",
      "status": "ready",
      "owner": "AI",
      "index": 1
    },
    {
      "label": "Shape offer",
      "detail": "Convert the brief into an outcome-focused fixed-fee package with tight acceptance criteria.",
      "status": "active",
      "owner": "Studio",
      "index": 2
    },
    {
      "label": "Price guardrail",
      "detail": "Compare effort, uncertainty, and payout timing before recommending a proposal band.",
      "status": "waiting",
      "owner": "Chris",
      "index": 3
    },
    {
      "label": "Handoff",
      "detail": "Produce reusable proposal notes, milestone copy, and follow-up questions.",
      "status": "queued",
      "owner": "Ops",
      "index": 4
    }
  ],
  "workItems": [
    {
      "title": "Requirement scan",
      "detail": "Separate must-have work from nice-to-have extras",
      "status": "ready"
    },
    {
      "title": "Milestone draft",
      "detail": "Create 2-sprint delivery shape",
      "status": "active"
    },
    {
      "title": "Question list",
      "detail": "Identify missing access and examples",
      "status": "waiting"
    },
    {
      "title": "Proposal packet",
      "detail": "Assemble cover note and deliverables",
      "status": "queued"
    }
  ],
  "deliverables": [
    {
      "title": "Scope card",
      "detail": "A concise buyer-goal summary with acceptance criteria."
    },
    {
      "title": "Estimate matrix",
      "detail": "A visible tradeoff table for speed, certainty, and effort."
    },
    {
      "title": "Reusable prompt kit",
      "detail": "Prompt blocks and QA checks that speed future proposals."
    }
  ],
  "timeline": [
    {
      "time": "0-1 hr",
      "detail": "Read post and extract decision points"
    },
    {
      "time": "1-2 hrs",
      "detail": "Build proposal package and risk matrix"
    },
    {
      "time": "2-3 hrs",
      "detail": "Finalize quote and human approval notes"
    }
  ],
  "proof": [
    "Demonstrates AI workflow setup without relying on live provider calls.",
    "Useful for Upwork leads who need structured estimates fast.",
    "Keeps final send decisions gated behind a human review."
  ]
} as const;

export type StageStatus = "ready" | "active" | "waiting" | "queued";
export type DemoStage = (typeof sample.stages)[number];
export type WorkItem = (typeof sample.workItems)[number];
