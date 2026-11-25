const STORAGE_KEY = 'word-chain-help-seen';

export function hasSeenHelp(): boolean {
    try {
        return localStorage.getItem(STORAGE_KEY) === 'true';
    } catch {
        return false;
    }
}

export function markHelpAsSeen(): void {
    try {
        localStorage.setItem(STORAGE_KEY, 'true');
    } catch {
        
    }
}