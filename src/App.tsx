import { useState, type SyntheticEvent } from 'react';
import { useWordChainGame } from './hooks/useWordChainGame';

function App() {
    const {
        chain,
        score,
        timeLeft,
        status,
        message,
        isValidating,
        submitWord,
        restart,
    } = useWordChainGame();
    const [input, setInput] = useState('');

    async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
        event.preventDefault();
        const accepted = await submitWord(input);
        if (accepted) setInput('');
    }

    function handleRestart() {
        restart();
        setInput('');
    }

    const isFinished = status === 'finished';

    return (
        <main>
            <h1>Word Chain</h1>

            <section>
                <p>Score: {score}</p>
                <p>Time left: {timeLeft}s</p>
            </section>

            {isFinished ? (
                <section>
                    <h2>Game over!</h2>
                    <p>Chained words: {chain.length}</p>
                    <p>Final score: {score}</p>
                    <button onClick={handleRestart}>Play again</button>
                </section>
            ) : (
                <form onSubmit={handleSubmit}>
                    <input
                        value={input}
                        onChange={(event) => setInput(event.target.value)}
                        placeholder={
                            chain.length === 0
                                ? 'Type any word to start'
                                : 'Type the next word'
                        }
                        autoFocus
                    />
                    <button type="submit" disabled={isValidating}>
                        {isValidating ? 'Checking...' : 'Send'}
                    </button>
                </form>
            )}

            {message && !isFinished && <p role="alert">{message}</p>}

            <ol>
                {chain.map((word) => (
                    <li key={word}>{word}</li>
                ))}
            </ol>
        </main>
    );
}

export default App;