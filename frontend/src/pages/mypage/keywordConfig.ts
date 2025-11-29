// Grouped keyword configuration for MyPage
export type KeywordGroupKey = 'exam' | 'assignment' | 'classStyle' | 'others';

export interface KeywordGroup {
  label: string;
  items: string[];
}

export const KEYWORD_GROUPS: Record<KeywordGroupKey, KeywordGroup> = {
  exam: {
    label: '시험유형',
    items: ['OX문제', '객관식', '단답형', '서술형', '풀이과정', '논술형'],
  },
  assignment: {
    label: '과제유형',
    items: ['보고서', '레포트', '발표', '팀플', '개인', '매주제출', '프로젝트'],
  },
  classStyle: {
    label: '수업방식',
    items: ['대면수업', '비대면수업', '인터넷강의', '토론', '퀴즈', '실습', '이론'],
  },
  others: {
    label: '기타키워드',
    items: ['출석중요', '시험중요', '과제중요', '컴퓨터실', '강의실'],
  },
};

export const DEFAULT_SELECTED_KEYWORDS: Record<KeywordGroupKey, string[]> = {
  exam: ['OX문제', '객관식'],
  assignment: ['보고서', '팀플'],
  classStyle: ['대면수업', '토론'],
  others: ['출석중요', '강의실'],
};

export const AVAILABLE_KEYWORDS = Object.fromEntries(
  Object.entries(KEYWORD_GROUPS).map(([k, v]) => [k, v.items])
) as Record<KeywordGroupKey, string[]>;

export default { KEYWORD_GROUPS, DEFAULT_SELECTED_KEYWORDS, AVAILABLE_KEYWORDS };
