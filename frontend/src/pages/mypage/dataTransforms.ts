import type { AcademicData, KeywordPrefs } from '../../types/mypage';
import type { CreditSummaryResponse } from '../../lib/api/mypage';
import { KEYWORD_GROUPS, type KeywordGroupKey } from './keywordConfig';

const CATEGORY_LABELS: Record<'major' | 'general' | 'elective', { key: string; name: string }> = {
  major: { key: 'major', name: '전공' },
  general: { key: 'general', name: '교양' },
  elective: { key: 'elective', name: '선택' },
};

export function mapCreditSummaryToAcademicData(response: CreditSummaryResponse): AcademicData {
  return {
    totalCredits: {
      current: response.total.acquired,
      required: response.total.required,
    },
    categories: (['major', 'general', 'elective'] as const).map((key) => ({
      key: CATEGORY_LABELS[key].key,
      name: CATEGORY_LABELS[key].name,
      current: response[key].acquired,
      required: response[key].required,
    })),
  };
}

const keywordLookup = new Map<string, KeywordGroupKey>();
(Object.entries(KEYWORD_GROUPS) as [KeywordGroupKey, { items: string[] }][])
  .forEach(([groupKey, group]) => {
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
      if (!selected[groupKey].includes(keyword)) selected[groupKey].push(keyword);
      return;
    }
    if ('others' in selected) {
      selected.others.push(keyword);
    }
  });

  return { selected };
}
