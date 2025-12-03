export type KeywordGroupKey = 'exam' | 'assignment' | 'classStyle' | 'others';

export interface KeywordGroup {
  label: string;
  items: string[];
}

export const KEYWORD_GROUPS: Record<KeywordGroupKey, KeywordGroup> = {
  exam: {
    label: '시험 형태',
    items: ['OX문제', '객관식', '주관식', '서술형', '프로젝트', '오픈북'],
  },
  assignment: {
    label: '과제 형태',
    items: ['보고서', '발표', '팀과제', '개인과제', '매주제출', '프로젝트'],
  },
  classStyle: {
    label: '수업 방식',
    items: ['대면수업', '비대면수업', '하이브리드', '토론', '퀴즈', '실습'],
  },
  others: {
    label: '기타 키워드',
    items: ['출석중요', '시험중요', '과제중요', '컴퓨터실', '강의평가'],
  },
};

export const DEFAULT_SELECTED_KEYWORDS: Record<KeywordGroupKey, string[]> = {
  exam: ['OX문제', '객관식'],
  assignment: ['보고서', '팀과제'],
  classStyle: ['대면수업', '실습'],
  others: ['출석중요', '강의평가'],
};

export const AVAILABLE_KEYWORDS = Object.fromEntries(
  Object.entries(KEYWORD_GROUPS).map(([k, v]) => [k, v.items])
) as Record<KeywordGroupKey, string[]>;

export default { KEYWORD_GROUPS, DEFAULT_SELECTED_KEYWORDS, AVAILABLE_KEYWORDS };
