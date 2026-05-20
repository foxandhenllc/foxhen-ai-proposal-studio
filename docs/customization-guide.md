# Customization Guide

Use this guide to adapt the studio for a new public-safe proposal scenario.

## 1. Update the Fixture

Edit `src/data/proposalFixture.ts`:

- `brand`: company name, public URLs, and theme colors.
- `intake`: fictional client brief, systems, budget signal, and success metric.
- `assumptions` and `exclusions`: scope boundaries that shape the proposal.
- `deliverables`: buyer-visible outputs and acceptance criteria.
- `timeline`: milestones, durations, owners, and review points.
- `riskFlags`: risks, severity, and mitigations.
- `estimate`: internal hours, rate, and margin target.

## 2. Adjust Scoring and Pricing

Edit `src/lib/proposalEngine.ts` when a service line needs different estimate logic:

- Complexity is based on deliverable count, system touchpoints, risk severity, and timeline pressure.
- Client range is derived from total internal hours and hourly rate.
- Internal suggested price includes the margin target and stays out of the client Markdown export.

## 3. Tune Exports

- Client proposal Markdown lives in `src/exporters/markdown.ts`.
- AI prompt pack JSON and full proposal snapshot JSON live in `src/exporters/json.ts`.
- Keep prompt pack instructions advisory and public-safe; do not add live model calls.

## 4. Validate Changes

Run:

```bash
npm run test:smoke
npm run typecheck
npm run build
```

The smoke test uses the fixture to verify proposal generation, Markdown export, and AI prompt pack JSON export.
