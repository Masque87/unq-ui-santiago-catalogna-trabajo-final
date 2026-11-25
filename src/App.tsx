import { useRef, useState } from 'react';
import { ChainPanel } from './components/ChainPanel';
import { GameOver } from './components/GameOver';
import { Header } from './components/Header';
import { HowToPlay } from './components/HowToPlay';
import { Leaderboard } from './components/Leaderboard';
import { WordForm } from './components/WordForm';
import { useLeaderboard } from './hooks/useLeaderboard';
import { useWordChainGame } from './hooks/useWordChainGame';
import { hasSeenHelp, markHelpAsSeen } from './services/helpStorage';

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

    const [showHelp, setShowHelp] = useState(() => !hasSeenHelp());
    const inputRef = useRef<HTMLInputElement>(null);

    function handleCloseHelp() {
        markHelpAsSeen();
        setShowHelp(false);
        inputRef.current?.focus();
    }

    return (
        <main>
            <Header
                score={score}
                timeLeft={timeLeft}
                isPlaying={status === 'playing'}
                onHelpClick={() => setShowHelp(true)}
            />

            <div className="layout">
                <ChainPanel chain={chain} />

                <section className="game">
                    {status === 'finished' ? (
                        <GameOver
                            score={score}
                            wordCount={chain.length}
                            onSave={(name) => addEntry(name, score, chain.length)}
                            onRestart={restart}
                        />
                    ) : (
                        <WordForm
                            onSubmit={submitWord}
                            isValidating={isValidating}
                            isFirstWord={chain.length === 0}
                            message={message}
                            inputRef={inputRef}
                        />
                    )}
                </section>

                <Leaderboard entries={entries} />
            </div>

            {showHelp && <HowToPlay onClose={handleCloseHelp} />}
        </main>
    );
}

export default App;