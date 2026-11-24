const STORAGE_KEY = 'word-chain-leaderboard';

export type LeaderboardEntry = {
    name: string;
    score: number;
    words: number;
};

export function loadLeaderboard(): LeaderboardEntry[] {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
}

export function saveLeaderboard(entries: LeaderboardEntry[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}