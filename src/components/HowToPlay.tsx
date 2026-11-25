import { TURN_SECONDS } from '../hooks/useWordChainGame';

const EXAMPLE_CHAIN = ['casa', 'árbol', 'luna'];

type HowToPlayProps = {
    onClose: () => void;
};

export function HowToPlay({ onClose }: HowToPlayProps) {
    return (
        <div className="modal-backdrop">
            <div
                className="modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="how-to-play-title"
            >
                <h2 id="how-to-play-title">How To Play</h2>
                <p className="modal-subtitle">
                    Build the longest chain of words before time runs out.
                </p>

                <ul>
                    <li>Each word must exist in the Spanish dictionary.</li>
                    <li>You can't repeat a word you already used.</li>
                    <li>Each word must start with the last letter of the previous one.</li>
                </ul>

                <h3>Example</h3>
                <ol className="chain">
                    {EXAMPLE_CHAIN.map((word, wordIndex) => (
                        <li key={word}>
                            {word.split('').map((letter, letterIndex) => {
                                const isFirstLink = letterIndex === 0 && wordIndex > 0;
                                const isLastLink =
                                    letterIndex === word.length - 1 &&
                                    wordIndex < EXAMPLE_CHAIN.length - 1;

                                return (
                                    <span
                                        key={letterIndex}
                                        className={
                                            isFirstLink || isLastLink ? 'tile tile-next' : 'tile'
                                        }
                                    >
                                        {letter}
                                    </span>
                                );
                            })}
                        </li>
                    ))}
                </ol>
                <p>Accents don't matter when linking words.</p>

                <h3>Score</h3>
                <p>Every letter is worth 1 point. The chain above gives 4 + 5 + 4 = 13 points.</p>

                <h3>Time</h3>
                <p>
                    You have {TURN_SECONDS} seconds per turn. The clock starts with your first
                    word and resets with every valid word. Invalid words don't reset it. When
                    it reaches 0, the game is over.
                </p>

                <h3>Leaderboard</h3>
                <p>
                    When the game ends, enter your name to save your score. The 10 best scores
                    are kept on this device.
                </p>

                <p className="modal-note">
                    Note: this game could be useful for non-native speakers to learn and
                    practice Spanish. Hope you like it!
                </p>

                <button onClick={onClose} autoFocus>
                    Play
                </button>
            </div>
        </div>
    );
}