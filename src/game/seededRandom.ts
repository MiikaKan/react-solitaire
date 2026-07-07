export function createSeededRandom(seed: string): () => number {
  let state = hashSeed(seed);

  return function random() {
    state = mulberry32Step(state);
    return state / 2 ** 32;
  };
}

function hashSeed(seed: string): number {
  let hash = 1779033703 ^ seed.length;

  for (let i = 0; i < seed.length; i++) {
    hash = Math.imul(hash ^ seed.charCodeAt(i), 3432918353);
    hash = (hash << 13) | (hash >>> 19);
  }

  return hash >>> 0;
}

function mulberry32Step(state: number): number {
  state = Math.imul(state ^ (state >>> 15), state | 1);
  state ^= state + Math.imul(state ^ (state >>> 7), state | 61);
  return ((state ^ (state >>> 14)) >>> 0);
}