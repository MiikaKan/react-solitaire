import { describe, expect, it } from 'vitest';
import { shuffle } from './shuffle';

describe('shuffle', () => {
    it('shuffled array is always same with same seed', () => {
        const numbers = [1, 2, 3, 4, 5];
        const shuffledNumbers1 = shuffle(numbers, 'test-seed');
        const shuffledNumbers2 = shuffle(numbers, 'test-seed');

        expect(shuffledNumbers1).toEqual(shuffledNumbers2);
    });

    it('shuffled array is different with different seed', () => {
        const numbers = [1, 2, 3, 4, 5];
        const shuffledNumbers1 = shuffle(numbers, 'test-seed-1');
        const shuffledNumbers2 = shuffle(numbers, 'test-seed-2');   
        
        expect(shuffledNumbers1).not.toEqual(shuffledNumbers2);
    });
});