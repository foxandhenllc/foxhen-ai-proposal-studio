# AI Proposal Studio Forking Guide

Use this guide to adapt the proposal/scoping assistant without introducing private data or hidden dependencies.

## Public-Safe Sample Scenario

- Service line: AI-assisted estimating and proposal scoping.
- Demo promise: Convert a rough client opportunity into assumptions, exclusions, deliverables, timeline, risk flags, estimate ranges, and exports.
- Fictional sample object: one complete proposal package.
- Runtime: static React + TypeScript + Vite, no backend, no auth, no secrets, no external API calls, and no live model calls.

## Replace First

1. Edit `src/data/proposalFixture.ts` for client scenario, brand colors, public URLs, intake, scope, risks, and estimate inputs.
2. Keep contacts, systems, workflow details, and examples fictional or explicitly client-approved.
3. Keep internal estimate logic in `src/lib/proposalEngine.ts` aligned with the new service line.
4. Refresh `docs/demo-screenshot.png` only with public-safe UI content after visual changes.

## Buyer Credibility Checklist

- The hero describes the proposal/scoping outcome in one sentence.
- The intake form captures enough context to justify scope and assumptions.
- Deliverables have acceptance criteria, and exclusions bound v1 clearly.
- Risk flags include severity and practical mitigations.
- Client-facing Markdown avoids internal costs while the internal estimate view keeps margin math visible.
- `npm run test:smoke`, `npm run typecheck`, and `npm run build` pass before deploy.

## Starter Adaptation Brief

Fork AI Proposal Studio as a public-safe proposal builder for a fictional client scenario. Update `src/data/proposalFixture.ts`, preserve the static no-backend/no-model-call architecture, customize exports in `src/exporters`, and publish only after smoke test, typecheck, and build pass.
