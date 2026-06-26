import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(root, '..', 'src', 'data');

const loadJson = async (name) => JSON.parse(await readFile(path.join(dataDir, name), 'utf8'));

const fail = (messages) => {
  if (messages.length > 0) {
    console.error(messages.map((message) => `- ${message}`).join('\n'));
    process.exit(1);
  }
};

const requiredText = (value) => typeof value === 'string' && value.trim().length > 0;
const hasBilingualText = (value) => value && requiredText(value.zh) && requiredText(value.en);
const isIsoDate = (value) => /^\d{4}-\d{2}-\d{2}$/.test(value);
const isValidUrl = (value) => {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
};

const errors = [];
const cases = await loadJson('cases.json');
const updates = await loadJson('updates.json');
const risks = await loadJson('risks.json');
const playbooks = await loadJson('playbooks.json');
const background = await loadJson('background.json');
const scholarship = await loadJson('scholarship.json');
const practice = await loadJson('practice.json');

const ids = new Set();
for (const item of cases) {
  const label = item.id || '(missing id)';
  if (!requiredText(item.id)) errors.push(`case missing id: ${JSON.stringify(item.title)}`);
  if (ids.has(item.id)) errors.push(`duplicate case id: ${item.id}`);
  ids.add(item.id);
  if (!isIsoDate(item.date)) errors.push(`${label}: date must be YYYY-MM-DD`);
  if (!isIsoDate(item.updated)) errors.push(`${label}: updated must be YYYY-MM-DD`);
  if (!isIsoDate(item.sourceLastChecked)) errors.push(`${label}: sourceLastChecked must be YYYY-MM-DD`);
  for (const field of ['title', 'summary', 'facts', 'complianceLessons']) {
    if (!hasBilingualText(item[field])) errors.push(`${label}: ${field} requires zh and en text`);
  }
  for (const field of ['company', 'jurisdiction', 'region', 'industry', 'status']) {
    if (!requiredText(item[field])) errors.push(`${label}: missing ${field}`);
  }
  if (!Array.isArray(item.riskTypes) || item.riskTypes.length === 0) errors.push(`${label}: riskTypes must not be empty`);
  if (!Array.isArray(item.legalIssues) || item.legalIssues.length === 0) errors.push(`${label}: legalIssues must not be empty`);
  if (!Array.isArray(item.sources) || item.sources.length === 0) errors.push(`${label}: sources must not be empty`);
  for (const source of item.sources ?? []) {
    if (!requiredText(source.label) || !isValidUrl(source.url) || !requiredText(source.type)) {
      errors.push(`${label}: invalid source ${JSON.stringify(source)}`);
    }
  }
}

for (const item of updates) {
  const label = item.id || '(missing id)';
  if (!requiredText(item.id)) errors.push(`update missing id`);
  if (!isIsoDate(item.date)) errors.push(`${label}: date must be YYYY-MM-DD`);
  if (item.effectiveDate && !isIsoDate(item.effectiveDate)) errors.push(`${label}: effectiveDate must be YYYY-MM-DD when present`);
  if (!hasBilingualText(item.title) || !hasBilingualText(item.summary)) errors.push(`${label}: update title and summary require zh/en`);
  if (!requiredText(item.jurisdiction)) errors.push(`${label}: missing jurisdiction`);
  if (!Array.isArray(item.riskTypes) || item.riskTypes.length === 0) errors.push(`${label}: riskTypes must not be empty`);
  if (!item.source || !requiredText(item.source.label) || !isValidUrl(item.source.url)) errors.push(`${label}: invalid source`);
}

for (const risk of risks) {
  if (!requiredText(risk.id) || !hasBilingualText(risk.title) || !hasBilingualText(risk.summary)) {
    errors.push(`risk entry is incomplete: ${JSON.stringify(risk.id)}`);
  }
  if (!Array.isArray(risk.controls) || risk.controls.length === 0) errors.push(`${risk.id}: controls must not be empty`);
}

for (const playbook of playbooks) {
  if (!requiredText(playbook.id) || !hasBilingualText(playbook.title) || !hasBilingualText(playbook.summary)) {
    errors.push(`playbook entry is incomplete: ${JSON.stringify(playbook.id)}`);
  }
  if (!Array.isArray(playbook.steps) || playbook.steps.length === 0) errors.push(`${playbook.id}: steps must not be empty`);
}

if (!isIsoDate(background.updated)) errors.push(`background: updated must be YYYY-MM-DD`);
if (!Array.isArray(background.sections) || background.sections.length < 3) errors.push(`background: expected at least 3 sections`);
for (const section of background.sections ?? []) {
  const label = section.id || '(missing id)';
  if (!requiredText(section.id) || !hasBilingualText(section.title) || !hasBilingualText(section.summary)) {
    errors.push(`background section incomplete: ${label}`);
  }
  if (!section.points || !Array.isArray(section.points.zh) || section.points.zh.length === 0 || !Array.isArray(section.points.en) || section.points.en.length === 0) {
    errors.push(`${label}: background points require zh and en arrays`);
  }
}
for (const item of background.comparison ?? []) {
  const label = item.concept?.en || '(missing concept)';
  for (const field of ['concept', 'question', 'evidence', 'owner']) {
    if (!hasBilingualText(item[field])) errors.push(`background comparison ${label}: ${field} requires zh/en`);
  }
}
for (const item of background.timeline ?? []) {
  const label = item.year || '(missing year)';
  if (!requiredText(item.year) || !hasBilingualText(item.title) || !hasBilingualText(item.summary)) {
    errors.push(`background timeline incomplete: ${label}`);
  }
}
for (const frame of background.theoryFrames ?? []) {
  const label = frame.id || '(missing id)';
  if (!requiredText(frame.id) || !hasBilingualText(frame.title) || !hasBilingualText(frame.summary)) {
    errors.push(`background theory frame incomplete: ${label}`);
  }
}
for (const source of background.sources ?? []) {
  if (!requiredText(source.label) || !isValidUrl(source.url) || !requiredText(source.type)) {
    errors.push(`background: invalid source ${JSON.stringify(source)}`);
  }
}

for (const item of scholarship) {
  const label = item.id || '(missing id)';
  if (!requiredText(item.id)) errors.push(`scholarship missing id`);
  if (!Number.isInteger(item.year) || item.year < 1900) errors.push(`${label}: scholarship year is invalid`);
  if (!requiredText(item.type) || !requiredText(item.authors) || !requiredText(item.venue)) errors.push(`${label}: scholarship metadata incomplete`);
  if (!hasBilingualText(item.title) || !hasBilingualText(item.summary)) errors.push(`${label}: scholarship title and summary require zh/en`);
  if (!isValidUrl(item.url)) errors.push(`${label}: scholarship url is invalid`);
  if (!Array.isArray(item.tags) || item.tags.length === 0) errors.push(`${label}: scholarship tags must not be empty`);
}

for (const item of practice) {
  const label = item.id || '(missing id)';
  if (!requiredText(item.id)) errors.push(`practice missing id`);
  if (!Number.isInteger(item.year) || item.year < 1900) errors.push(`${label}: practice year is invalid`);
  if (!requiredText(item.type) || !requiredText(item.organization)) errors.push(`${label}: practice metadata incomplete`);
  if (!hasBilingualText(item.title) || !hasBilingualText(item.summary) || !hasBilingualText(item.useCase)) errors.push(`${label}: practice title, summary, and useCase require zh/en`);
  if (!isValidUrl(item.url)) errors.push(`${label}: practice url is invalid`);
  if (!Array.isArray(item.riskTypes) || item.riskTypes.length === 0) errors.push(`${label}: practice riskTypes must not be empty`);
  if (!Array.isArray(item.tags) || item.tags.length === 0) errors.push(`${label}: practice tags must not be empty`);
}

if (cases.length < 30) errors.push(`expected at least 30 cases; found ${cases.length}`);
if (updates.length < 12) errors.push(`expected at least 12 legal updates; found ${updates.length}`);
if (scholarship.length < 10) errors.push(`expected at least 10 scholarship resources; found ${scholarship.length}`);
if (practice.length < 10) errors.push(`expected at least 10 practice resources; found ${practice.length}`);

fail(errors);
console.log(`Validated ${cases.length} cases, ${updates.length} updates, ${risks.length} risk areas, ${playbooks.length} playbooks, ${scholarship.length} scholarship resources, and ${practice.length} practice resources.`);
