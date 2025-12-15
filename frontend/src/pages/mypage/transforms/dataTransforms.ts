import type { AcademicData, KeywordPrefs } from '@/types/mypage';
import type { CreditSummaryResponse } from '@/lib/api/mypage';
import { KEYWORD_GROUPS, type KeywordGroupKey } from '../keywordConfig';

const CREDIT_SECTIONS = [
  { field: 'major_required', key: 'major-required', name: '전공필수' },
  { field: 'major_elective', key: 'major-elective', name: '전공선택' },
  { field: 'core_general', key: 'core-general', name: '핵심교양' },
  { field: 'balance_general', key: 'balance-general', name: '균형교양' },
] as const;

export function mapCreditSummaryToAcademicData(response: CreditSummaryResponse): AcademicData {
  return {
    totalCredits: {
      current: response.total.acquired,
      required: response.total.required,
    },
    categories: CREDIT_SECTIONS.map(({ field, key, name }) => ({
      key,
      name,
      current: response[field].acquired,
      required: response[field].required,
    })),
  };
}

const keywordLookup = new Map<string, KeywordGroupKey>();
(Object.entries(KEYWORD_GROUPS) as [KeywordGroupKey, { items: string[] }][]).forEach(([groupKey, group]) => {
  group.items.forEach((kw) => {
    if (!keywordLookup.has(kw)) {
      keywordLookup.set(kw, groupKey);
    }
  });
});

const emptySelected = (): Record<KeywordGroupKey, string[]> =>
  (Object.keys(KEYWORD_GROUPS) as KeywordGroupKey[]).reduce(
    (acc, key) => {
      acc[key] = [];
      return acc;
    },
    {} as Record<KeywordGroupKey, string[]>,
  );

export function mapKeywordsToPrefs(keywords: string[]): KeywordPrefs {
  const selected = emptySelected();

  keywords.forEach((keyword) => {
    const groupKey = keywordLookup.get(keyword);
    if (groupKey) {
      if (!selected[groupKey].includes(keyword)) {
        selected[groupKey].push(keyword);
      }
      return;
    }
    if ('others' in selected) {
      selected.others.push(keyword);
    }
  });

  return { selected };
}
