import clauseData from '@/data/clauses.json';

export type SlotId = 'recognition' | 'shared' | 'encouragement' | 'hope';

export type Clause = { id: string; en: string };
export type Slot = { id: SlotId; order: number; label: string; clauses: Clause[] };

export const slots = clauseData.slots as Slot[];

export const SLOT_IDS: SlotId[] = ['recognition', 'shared', 'encouragement', 'hope'];

export function getSlot(slotId: SlotId): Slot {
  const slot = slots.find((s) => s.id === slotId);
  if (!slot) throw new Error(`Unknown slot: ${slotId}`);
  return slot;
}

// Built once when the module loads, not on every request.
const validIds: Record<SlotId, Set<string>> = {
  recognition: new Set(getSlot('recognition').clauses.map((c) => c.id)),
  shared: new Set(getSlot('shared').clauses.map((c) => c.id)),
  encouragement: new Set(getSlot('encouragement').clauses.map((c) => c.id)),
  hope: new Set(getSlot('hope').clauses.map((c) => c.id)),
};

export function isValidClause(slotId: SlotId, value: unknown): value is string {
  return typeof value === 'string' && validIds[slotId].has(value);
}

export function clauseText(slotId: SlotId, clauseId: string): string | null {
  return getSlot(slotId).clauses.find((c) => c.id === clauseId)?.en ?? null;
}