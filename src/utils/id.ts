export const createId = () =>
  Math.random().toString(36).slice(2, 7) + Date.now().toString(36);
