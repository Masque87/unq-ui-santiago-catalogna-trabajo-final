import { useEffect, useRef } from 'react';
import { Icon } from './Icon';
import chainIcon from '../assets/chain.svg';

type ChainPanelProps = {
    chain: string[];
};

export function ChainPanel({ chain }: ChainPanelProps) {
    const listRef = useRef<HTMLOListElement>(null);

    useEffect(() => {
        const list = listRef.current;
        if (list) list.scrollTop = list.scrollHeight;
    }, [chain.length]);

    return (
        <aside className="panel">
            <h2 className="panel-title">
                <Icon src={chainIcon} />
                Chain
            </h2>
            <ol className="chain chain-scroll" ref={listRef}>
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
    );
}