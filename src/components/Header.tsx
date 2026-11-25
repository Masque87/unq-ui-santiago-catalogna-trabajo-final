import { TURN_SECONDS } from '../hooks/useWordChainGame';
import { Icon } from './Icon';
import coinIcon from '../assets/coinP.svg';
import timerIcon from '../assets/timer.svg';

const LOW_TIME_SECONDS = 5;

type HeaderProps = {
    score: number;
    timeLeft: number;
    isPlaying: boolean;
    onHelpClick: () => void;
};

export function Header({ score, timeLeft, isPlaying, onHelpClick }: HeaderProps) {
    const isLowTime = isPlaying && timeLeft <= LOW_TIME_SECONDS;

    const timeRatio = timeLeft / TURN_SECONDS;
    const barColor = `hsl(${Math.round(timeRatio * 120)}, 65%, 42%)`;

    return (
        <header className="header">
            <p className="stat">
                <Icon src={coinIcon} className="coin" />
                Score: <strong>{score}</strong>
            </p>

            <div className="title">
                <h1>Word Chain</h1>
                <button
                    className="help-button"
                    onClick={onHelpClick}
                    disabled={isPlaying}
                    aria-label="How to play"
                    title={isPlaying ? 'Not available while playing' : 'How to play'}
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
    );
}