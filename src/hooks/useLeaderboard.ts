import { useCallback, useEffect, useState } from 'react';
import { loadLeaderboard, saveLeaderboard, type LeaderboardEntry } from '../services/leaderboardStorage';

const MAX_ENTRIES = 10;

export function useLeaderboard() {
    const [entries, setEntries] = useState<LeaderboardEntry[]>(loadLeaderboard);

    useEffect(() => {
        saveLeaderboard(entries);
    }, [entries]);

    const addEntry = useCallback((name: string, score: number, words: number) => {
    const newEntry = { name, score, words };

    setEntries((prev) =>
        [...prev, newEntry]
            .sort((a, b) => b.score - a.score)
            .slice(0, MAX_ENTRIES)
    );
}, []);

    return { entries, addEntry };
}