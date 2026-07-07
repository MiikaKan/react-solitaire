import { createSeededRandom } from './seededRandom';

export function shuffle<T>(items: T[], seed: string): T[] {
    const random = createSeededRandom(seed);
    const shuffledItems = [...items];

    for(let i = shuffledItems.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        [shuffledItems[i], shuffledItems[j]] = [shuffledItems[j], shuffledItems[i]];
    }

    return shuffledItems;
}
