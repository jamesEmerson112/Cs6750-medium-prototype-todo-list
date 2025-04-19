/**
 * Remove leading emoji and space from a task string.
 */
export function stripEmoji(task: string): string {
  return task.replace(/^[^\w\d]+ /, "");
}

/**
 * Fisher-Yates shuffle for random order.
 */
export function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
