export type Lang = 'zh' | 'en';

export const sourceCheckedDate = '2026-06-26';

export const labels = {
  zh: {
    brand: '中国企业出海风险与合规研究门户',
    shortBrand: '企业出海',
    nav: {
      risks: '风险地图',
      cases: '案例库',
      updates: '最新发展',
      playbooks: '合规工具',
      sources: '资料来源'
    },
    language: 'English',
    sourceCheck: '资料校验截至',
    readMore: '查看案例',
    caseLibrary: '案例库',
    all: '全部',
    search: '搜索企业、法域、风险或关键词',
    filters: '筛选',
    noResults: '没有匹配案例',
    source: '来源',
    legalIssues: '主要法律问题',
    facts: '事实脉络',
    complianceLessons: '合规启示',
    riskTypes: '风险类型',
    status: '状态',
    jurisdiction: '法域',
    industry: '行业',
    updated: '更新',
    backToCases: '返回案例库'
  },
  en: {
    brand: 'Chinese Companies Overseas Risk and Compliance Portal',
    shortBrand: 'Chuhai Risk',
    nav: {
      risks: 'Risk Map',
      cases: 'Cases',
      updates: 'Developments',
      playbooks: 'Playbooks',
      sources: 'Sources'
    },
    language: '中文',
    sourceCheck: 'Source check current as of',
    readMore: 'Read case',
    caseLibrary: 'Case Library',
    all: 'All',
    search: 'Search company, jurisdiction, risk, or keyword',
    filters: 'Filters',
    noResults: 'No matching cases',
    source: 'Sources',
    legalIssues: 'Legal issues',
    facts: 'Facts',
    complianceLessons: 'Compliance lessons',
    riskTypes: 'Risk types',
    status: 'Status',
    jurisdiction: 'Jurisdiction',
    industry: 'Industry',
    updated: 'Updated',
    backToCases: 'Back to cases'
  }
} as const;

export const text = (value: { zh: string; en: string }, lang: Lang) => value[lang];

export const pathFor = (lang: Lang, route = '') => {
  const configuredBase = import.meta.env.BASE_URL;
  const base = configuredBase.endsWith('/') ? configuredBase : `${configuredBase}/`;
  const cleanRoute = route.replace(/^\/+/, '');
  const langPrefix = lang === 'en' ? 'en/' : '';
  return `${base}${langPrefix}${cleanRoute}`;
};

export const alternatePathFor = (lang: Lang, route = '') => pathFor(lang === 'en' ? 'zh' : 'en', route);

export const riskLabel = (id: string, lang: Lang, risks: Array<{ id: string; title: { zh: string; en: string } }>) => {
  const risk = risks.find((item) => item.id === id);
  return risk ? text(risk.title, lang) : id;
};

export const formatDate = (value: string, lang: Lang) => {
  const date = new Date(`${value}T00:00:00Z`);
  return new Intl.DateTimeFormat(lang === 'zh' ? 'zh-Hans' : 'en', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC'
  }).format(date);
};
