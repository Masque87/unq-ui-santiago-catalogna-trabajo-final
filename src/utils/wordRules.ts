// Lowercases and removes accents, but keeps the "ñ" as its own letter.
export function normalizeWord(word: string): string {
    return word
        .trim()
        .toLowerCase()
        .normalize('NFD')
        .replace(/n\u0303/g, 'ñ')
        .replace(/[\u0300-\u036f]/g, '');
}

export function isAlreadyUsed(word: string, chain: string[]): boolean {
    const normalized = normalizeWord(word);
    return chain.some((usedWord) => normalizeWord(usedWord) === normalized);
}

export function followsChain(word: string, chain: string[]): boolean {
    if (chain.length === 0) return true;

    const lastWord = normalizeWord(chain[chain.length - 1]);
    return normalizeWord(word).startsWith(lastWord.slice(-1));
}

export function getWordScore(word: string): number {
    return word.trim().length;
}