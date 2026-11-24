import { useEffect, useRef, useState } from 'react';
import { wordExists } from '../services/wordApi';
import {
    followsChain,
    getWordScore,
    isAlreadyUsed,
    normalizeWord,
} from '../utils/wordRules';

const TURN_SECONDS = 15;

type GameStatus = 'waiting' | 'playing' | 'finished';

export function useWordChainGame() {
    const [chain, setChain] = useState<string[]>([]);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(TURN_SECONDS);
    const [status, setStatus] = useState<GameStatus>('waiting');
    const [message, setMessage] = useState('');
    const [isValidating, setIsValidating] = useState(false);

    const statusRef = useRef<GameStatus>(status);
    useEffect(() => {
        statusRef.current = status;
    }, [status]);

    useEffect(() => {
        if (status !== 'playing' || isValidating) return;

        if (timeLeft === 0) {
            setStatus('finished');
            return;
        }

    const timeoutId = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timeoutId);
    }, [status, timeLeft, chain.length, isValidating]);

    async function submitWord(rawWord: string): Promise<boolean> {
        const word = rawWord.trim().toLowerCase();

        if (status === 'finished' || isValidating) return false;

        if (word === '') {
            setMessage('Type a word first.');
            return false;
        }

        if (isAlreadyUsed(word, chain)) {
            setMessage('That word was already used.');
            return false;
        }

        if (!followsChain(word, chain)) {
            const lastLetter = normalizeWord(chain[chain.length - 1]).slice(-1);
            setMessage(`The word must start with "${lastLetter}".`);
            return false;
        }

        setIsValidating(true);
        try {
            const exists = await wordExists(word);

            if (statusRef.current === 'finished') return false;

            if (!exists) {
                setMessage('That word does not exist.');
                return false;
            }

            setChain((prev) => [...prev, word]);
            setScore((prev) => prev + getWordScore(word));
            setTimeLeft(TURN_SECONDS);
            setStatus('playing');
            setMessage('');
            return true;
        } catch {
            setMessage('Could not check the word. Try again.');
            return false;
        } finally {
            setIsValidating(false);
        }
    }

    function restart() {
        setChain([]);
        setScore(0);
        setTimeLeft(TURN_SECONDS);
        setStatus('waiting');
        setMessage('');
    }

    return {
        chain,
        score,
        timeLeft,
        status,
        message,
        isValidating,
        submitWord,
        restart,
    };
}