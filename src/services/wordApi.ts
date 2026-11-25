const API_URL = 'https://word-api-hmlg.vercel.app';

export async function wordExists(word: string): Promise<boolean> {
    const response = await fetch(
        `${API_URL}/api/validate?word=${encodeURIComponent(word)}`,
        { signal: AbortSignal.timeout(5000) }
    );

    if (!response.ok) {
        throw new Error('Could not validate the word');
    }

    const data: { exists: boolean } = await response.json();
    return data.exists;
}