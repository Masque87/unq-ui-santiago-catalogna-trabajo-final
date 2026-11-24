import { useState, type SyntheticEvent } from 'react';
import { TURN_SECONDS, useWordChainGame } from './hooks/useWordChainGame';
import { useLeaderboard } from './hooks/useLeaderboard';
import { Icon } from './components/Icon';
import coinIcon from './assets/coinP.svg';
import coinStackIcon from './assets/coin.svg';
import timerIcon from './assets/timer.svg';
import trophyIcon from './assets/trophy.svg';
import medalIcon from './assets/medal.svg';
import wordIcon from './assets/word.svg';

const MAX_NAME_LENGTH = 10;
const LOW_TIME_SECONDS = 5;
const LEADERBOARD_SLOTS = 10;
const MEDALS = 3;

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
    const { entries, addEntry } = useLeaderboard();

    const [input, setInput] = useState('');
    const [playerName, setPlayerName] = useState('');
    const [scoreSaved, setScoreSaved] = useState(false);

    const isFinished = status === 'finished';
    const isLowTime = status === 'playing' && timeLeft <= LOW_TIME_SECONDS;


    const timeRatio = timeLeft / TURN_SECONDS;
    const barColor = `hsl(${Math.round(timeRatio * 120)}, 65%, 42%)`;

    const rows = Array.from({ length: LEADERBOARD_SLOTS }, (_, index) => entries[index]);

    async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
        event.preventDefault();
        const accepted = await submitWord(input);
        if (accepted) setInput('');
    }

    function handleSaveScore(event: SyntheticEvent<HTMLFormElement>) {
        event.preventDefault();
        addEntry(playerName.trim(), score, chain.length);
        setScoreSaved(true);
    }

    function handleRestart() {
        restart();
        setInput('');
        setPlayerName('');
        setScoreSaved(false);
    }

    return (
        <main>
            <header className="header">
                <p className="stat">
                    <Icon src={coinIcon} className="coin" />
                    Score: <strong>{score}</strong>
                </p>
                <h1>Word Chain</h1>
                <p className={isLowTime ? 'stat stat-right danger' : 'stat stat-right'}>
                    <Icon src={timerIcon} />
                    Time: <strong>{timeLeft}s</strong>
                </p>

                <div
                    className="time-bar"
                    role="progressbar"
                    aria-label="Time left"
                    aria-valuemin={0}
                    aria-valuemax={TURN_SECONDS}
                    aria-valuenow={timeLeft}
                >
                    <div
                        className="time-bar-fill"
                        style={{ width: `${timeRatio * 100}%`, backgroundColor: barColor }}
                    />
                </div>
            </header>

            <div className="layout">
                <aside className="panel">
                    <h2>Chain</h2>
                    <ol className="chain">
                        {chain.map((word, wordIndex) => (
                            <li key={word}>
                                {word.split('').map((letter, letterIndex) => {
                                    const isNextLetter =
                                        wordIndex === chain.length - 1 &&
                                        letterIndex === word.length - 1;

                                    return (
                                        <span
                                            key={letterIndex}
                                            className={isNextLetter ? 'tile tile-next' : 'tile'}
                                        >
                                            {letter}
                                        </span>
                                    );
                                })}
                            </li>
                        ))}
                    </ol>
                </aside>

                <section className="game">
                    {isFinished ? (
                        <div className="game-over">
                            <h2>Game over!</h2>
                            <p>Chained words: {chain.length}</p>
                            <p>
                                <Icon src={coinStackIcon} className="coin" />
                                Final score: {score}
                            </p>

                            {scoreSaved ? (
                                <p>Score saved!</p>
                            ) : (
                                <form onSubmit={handleSaveScore}>
                                    <input
                                        value={playerName}
                                        onChange={(event) => setPlayerName(event.target.value)}
                                        placeholder="Your name"
                                        maxLength={MAX_NAME_LENGTH}
                                    />
                                    <button type="submit" disabled={playerName.trim() === ''}>
                                        Save score
                                    </button>
                                </form>
                            )}

                            <button onClick={handleRestart}>Play again</button>
                        </div>
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

                    {message && !isFinished && (
                        <p role="alert" className="message">
                            {message}
                        </p>
                    )}
                </section>

                <aside className="panel">
                    <h2 className="panel-title">
                        <Icon src={trophyIcon} />
                        Top 10
                    </h2>

                    <table className="leaderboard">
                        <thead>
                            <tr>
                                <th aria-label="Rank" />
                                <th>Player</th>
                                <th aria-label="Score" title="Score">
                                    <Icon src={coinIcon} />
                                </th>
                                <th aria-label="Words" title="Words">
                                    <Icon src={wordIcon} />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((entry, index) => (
                                <tr key={index} className={index >= MEDALS ? 'row-rest' : undefined}>
                                    <td>
                                        {entry && index < MEDALS && (
                                            <Icon
                                                src={medalIcon}
                                                className={`medal medal-${index + 1}`}
                                            />
                                        )}
                                    </td>
                                    <td>{entry?.name}</td>
                                    <td>{entry?.score}</td>
                                    <td>{entry?.words}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {entries.length === 0 && (
                        <p className="empty">No scores yet. Finish a game to join the board.</p>
                    )}
                </aside>
            </div>
        </main>
    );
}

export default App;