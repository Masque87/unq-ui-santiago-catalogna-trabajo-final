import { useState, type SyntheticEvent } from 'react';
import { Icon } from './Icon';
import chainIcon from '../assets/chain.svg';
import coinStackIcon from '../assets/coin.svg';

const MAX_NAME_LENGTH = 10;

type GameOverProps = {
    score: number;
    wordCount: number;
    onSave: (name: string) => void;
    onRestart: () => void;
};

export function GameOver({ score, wordCount, onSave, onRestart }: GameOverProps) {
    const [playerName, setPlayerName] = useState('');
    const [scoreSaved, setScoreSaved] = useState(false);

    function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
        event.preventDefault();
        onSave(playerName.trim());
        setScoreSaved(true);
    }

    return (
        <div className="game-over">
            <h2>Game over!</h2>
            <p className="result-line">
                <Icon src={chainIcon} className="chain-icon" />
                Chained words: {wordCount}
            </p>
            <p className="result-line">
                <Icon src={coinStackIcon} className="coin" />
                Final score: {score}
            </p>

            {scoreSaved ? (
                <p>Score saved!</p>
            ) : (
                <form onSubmit={handleSubmit}>
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

            <button onClick={onRestart}>Play again</button>
        </div>
    );
}