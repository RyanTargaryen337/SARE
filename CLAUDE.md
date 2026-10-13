# Sàrè

## Skill routing

When the user's request matches an available skill, invoke it via the Skill tool. Route only to skills in the session's available-skills list; answer directly for quick questions or small scoped edits.

Key routing rules:
- Product ideas/brainstorming → invoke /office-hours
- Strategy/scope → invoke /plan-ceo-review
- Architecture → invoke /plan-eng-review
- Design system/plan review → invoke /design-consultation or /plan-design-review
- Full review pipeline → invoke /autoplan
- Bugs/errors → invoke /investigate
- QA/testing site behavior → invoke /qa or /qa-only
- Code review/diff check → invoke /review
- Visual polish → invoke /design-review
- Ship/deploy/PR → invoke /ship or /land-and-deploy
- Save progress → invoke /context-save
- Resume context → invoke /context-restore
- Author a backlog-ready spec/issue → invoke /spec

## Testing

- Unit: `npm test` (Vitest, jsdom; files `src/**/*.test.{ts,tsx}`)
- E2E smoke: `npm run test:e2e` (Playwright; builds, serves on :4173; uses `/opt/pw-browsers/chromium` in cloud containers)
- Lint/build: `npm run lint`, `npm run build`
- Write a regression test with every bug fix; never commit failing tests.
