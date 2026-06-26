# 中国企业出海风险与合规研究门户

This repository hosts a bilingual static research portal on political, legal, and compliance risks for Chinese companies going global.

## Local Development

```powershell
pnpm install
pnpm validate:data
pnpm check
pnpm build
pnpm dev
```

The site is built with Astro and is configured for GitHub Pages at `/chuhai/`.

## Content Model

- `src/data/cases.json`: case briefs rendered into the searchable case library and case detail pages.
- `src/data/updates.json`: legal and regulatory development timeline.
- `src/data/risks.json`: risk-map taxonomy.
- `src/data/playbooks.json`: compliance playbooks.

Run `pnpm validate:data` before publishing. The validator checks bilingual fields, required metadata, source URL format, and minimum content counts.

## Source Policy

The first public version uses `2026-06-26` as the source-check date. Official, regulator, court, and international organization sources are preferred. Media sources are used only when primary sources do not fully cover labour, litigation, or commercial developments.
