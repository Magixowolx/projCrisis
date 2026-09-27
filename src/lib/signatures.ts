// src/lib/signatures.ts
export const SIGNATURES = [
  '🕯️', '🌱', '🌙', '⭐', '🤍',
  '☕', '🌊', '🍀', '🪶', '🫂',
] as const;

const SET = new Set<string>(SIGNATURES);

export function isValidSignature(value: unknown): value is string {
  return typeof value === 'string' && SET.has(value);
}

export function randomSignature(): string {
  const index = Math.floor(Math.random() * SIGNATURES.length);
  return SIGNATURES[index];
}