import { Icon } from './Icon';
import type { LeaderboardEntry } from '../services/leaderboardStorage';
import coinIcon from '../assets/coinP.svg';
import medalIcon from '../assets/medal.svg';
import playerIcon from '../assets/player.svg';
import trophyIcon from '../assets/trophy.svg';
import wordIcon from '../assets/word.svg';

const LEADERBOARD_SLOTS = 10;
const MEDALS = 3;

type LeaderboardProps = {
    entries: LeaderboardEntry[];
};

export function Leaderboard({ entries }: LeaderboardProps) {
    const rows = Array.from({ length: LEADERBOARD_SLOTS }, (_, index) => entries[index]);

    return (
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
    );
}