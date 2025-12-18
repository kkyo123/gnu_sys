// src/pages/search/utils/courseTags.ts
export const KEY_TO_TAG: Record<string, string> = {
  balancedGeneral: 'balance_general',
  basicGeneral: 'basic_general',
  coreGeneral: 'core_general',
  teacherTraining: 'teacher_training',
  generalElective: 'general_elective',
  majorRequired: 'major_required',
  majorElective: 'major_elective',
};

export function deriveTags(raw: any): string[] {
  const tags: string[] = [];
  const cat = String(raw?.category ?? '').toLowerCase();
  const gen = String(raw?.general_type ?? '').toLowerCase();
  const grp = String(raw?.group ?? '').toLowerCase();
  const src = String(raw?.source_collection ?? '').toLowerCase();

  if (cat.includes('전공필수')) tags.push('major_required');
  if (cat.includes('전공선택')) tags.push('major_elective');

  if (gen.includes('핵심') || src.includes('core_general')) tags.push('core_general');
  if (gen.includes('균형') || src.includes('balance_general')) tags.push('balance_general');
  if (gen.includes('기초') || src.includes('basic_general')) tags.push('basic_general');

  if (gen.includes('일반선택') || cat.includes('일반선택') || src.includes('courses_normalstudy')) tags.push('general_elective');
  if (gen.includes('교직') || cat.includes('교직')) tags.push('teacher_training');

  if (grp.includes('교양') && !tags.some(t => t.startsWith('major_'))) {
    if (!tags.includes('core_general') && !tags.includes('balance_general') && !tags.includes('basic_general')) {
      tags.push('general_elective');
    }
  }

  return Array.from(new Set(tags));
}
