import { useEffect, useRef, useState, type SyntheticEvent } from 'react';
import { HowToPlay } from './components/HowToPlay';
import { TURN_SECONDS, useWordChainGame } from './hooks/useWordChainGame';
import { useLeaderboard } from './hooks/useLeaderboard';
import { hasSeenHelp, markHelpAsSeen } from './services/helpStorage';
import { Icon } from './components/Icon';
import coinIcon from './assets/coinP.svg';
import coinStackIcon from './assets/coin.svg';
import timerIcon from './assets/timer.svg';
import trophyIcon from './assets/trophy.svg';
import medalIcon from './assets/medal.svg';
import wordIcon from './assets/word.svg';
import chainIcon from './assets/chain.svg';
import playerIcon from './assets/player.svg';

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
    const [showHelp, setShowHelp] = useState(() => !hasSeenHelp());
    const inputRef = useRef<HTMLInputElement>(null);
    const chainRef = useRef<HTMLOListElement>(null);

    const isFinished = status === 'finished';
    const isLowTime = status === 'playing' && timeLeft <= LOW_TIME_SECONDS;

    const timeRatio = timeLeft / TURN_SECONDS;
    const barColor = `hsl(${Math.round(timeRatio * 120)}, 65%, 42%)`;

    const rows = Array.from({ length: LEADERBOARD_SLOTS }, (_, index) => entries[index]);

    useEffect(() => {
        const list = chainRef.current;
        if (list) list.scrollTop = list.scrollHeight;
    }, [chain.length]);

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

    function handleCloseHelp() {
        markHelpAsSeen();
        setShowHelp(false);
        inputRef.current?.focus();
    }  



    return (
        <main>
            <header className="header">
                <p className="stat">
                    <Icon src={coinIcon} className="coin" />
                    Score: <strong>{score}</strong>
                </p>

                <div className="title">
                    <h1>Word Chain</h1>
                    <button
                        className="help-button"
                        onClick={() => setShowHelp(true)}
                        disabled={status === 'playing'}
                        aria-label="How to play"
                        title={status === 'playing' ? 'Not available while playing' : 'How to play'}
                    >
                        ?
                    </button>
                </div>

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
                    <h2 className="panel-title">
                      <Icon src={chainIcon} />
                        Chain
                    </h2>
                    <ol className="chain chain-scroll" ref={chainRef}>
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
                            <p className="result-line">
                                <Icon src={chainIcon} className="chain-icon" />
                                Chained words: {chain.length}
                            </p>
                            <p className="result-line">
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
                                ref={inputRef}
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
                                <th>
                                    <Icon src={playerIcon} /> Player
                                </th>
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
                                <tr
                                    key={index}
                                    className={index >= MEDALS ? 'row-rest' : undefined}
                                >
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

            {showHelp && <HowToPlay onClose={handleCloseHelp} />}
        </main>
    );
}

export default App;