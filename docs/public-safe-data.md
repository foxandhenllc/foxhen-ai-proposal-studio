# Public-Safe Data Guide

This repo is designed as a public, forkable proposal/scoping assistant. Keep every demo scenario fictional or explicitly approved for public use.

## Allowed in Fixtures

- Fictional client names, industries, workflows, systems, assumptions, exclusions, and risks.
- Synthetic sample summaries that demonstrate structure without exposing real people or accounts.
- High-level budget ranges, estimate logic, and generic timeline examples.
- Public brand links and repository/demo URLs.

## Not Allowed

- Real customer records, private contacts, credentials, API keys, tokens, session IDs, or `.env` values.
- PHI, patient data, employee records, copied client documents, or proprietary source material.
- Screenshots of internal tools, inboxes, dashboards, analytics, or account settings.
- Live model calls, backend requests, authentication flows, or hidden service integrations in v1.

## Review Checklist

1. Search fixture data and docs for real names, emails, phone numbers, addresses, IDs, and secrets.
2. Confirm exports contain only client-approved or fictional data.
3. Keep internal estimate details out of the client-facing Markdown proposal.
4. Run `npm run test:smoke`, `npm run typecheck`, and `npm run build` before publishing a fork.
