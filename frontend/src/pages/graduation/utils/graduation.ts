export const percent = (completed: number, total: number) =>
  total === 0 ? 0 : Math.round((completed / total) * 100);

export const remaining = (completed: number, total: number) =>
  Math.max(0, total - completed);
