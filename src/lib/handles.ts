export const ADJECTIVES = [
  'Quiet', 'Gentle', 'Patient', 'Steady', 'Kind', 'Wandering',
  'Sleepy', 'Curious', 'Soft', 'Calm', 'Small', 'Warm',
  'Clear', 'Slow', 'Honest', 'Humble', 'Lucky', 'Brave',
  'Nimble', 'Eager', 'Cheerful', 'Tender', 'Sunny', 'Dusty',
  'Northern', 'Amber', 'Silver', 'Golden', 'Velvet', 'Paper',
  'Pocket', 'Garden', 'Morning', 'Evening', 'Summer', 'Winter',
  'Copper', 'Linen', 'Wooden', 'Woolly',
];

export const NOUNS = [
  'Heron', 'Lantern', 'River', 'Willow', 'Sparrow', 'Fox',
  'Otter', 'Maple', 'Harbor', 'Meadow', 'Compass', 'Kettle',
  'Anchor', 'Beacon', 'Cedar', 'Robin', 'Finch', 'Badger',
  'Hedgehog', 'Pebble', 'Fern', 'Moss', 'Orchard', 'Cove',
  'Ridge', 'Brook', 'Feather', 'Acorn', 'Clover', 'Juniper',
  'Aspen', 'Birch', 'Heather', 'Linden', 'Hazel', 'Wren',
  'Swallow', 'Lark', 'Crane', 'Hare',
];

const ADJ_SET = new Set(ADJECTIVES);
const NOUN_SET = new Set(NOUNS);

export type Handle = { adjective: string; noun: string };

export function isValidHandle(adjective: unknown, noun: unknown): boolean {
  return (
    typeof adjective === 'string' &&
    typeof noun === 'string' &&
    ADJ_SET.has(adjective) &&
    NOUN_SET.has(noun)
  );
}

export function randomHandles(count: number): Handle[] {
  const out: Handle[] = [];
  const seen = new Set<string>();
  while (out.length < count) {
    const adjective = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
    const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
    const key = `${adjective} ${noun}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ adjective, noun });
  }
  return out;
}