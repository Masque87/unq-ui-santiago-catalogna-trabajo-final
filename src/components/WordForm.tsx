import { useState, type RefObject, type SyntheticEvent } from 'react';

type WordFormProps = {
    onSubmit: (word: string) => Promise<boolean>;
    isValidating: boolean;
    isFirstWord: boolean;
    message: string;
    inputRef: RefObject<HTMLInputElement | null>;
};

export function WordForm({
    onSubmit,
    isValidating,
    isFirstWord,
    message,
    inputRef,
}: WordFormProps) {
    const [input, setInput] = useState('');

    async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
        event.preventDefault();
        const accepted = await onSubmit(input);
        if (accepted) setInput('');
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <input
                    ref={inputRef}
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    placeholder={isFirstWord ? 'Type any word to start' : 'Type the next word'}
                    autoFocus
                />
                <button type="submit" disabled={isValidating}>
                    {isValidating ? 'Checking...' : 'Send'}
                </button>
            </form>

            {message && (
                <p role="alert" className="message">
                    {message}
                </p>
            )}
        </>
    );
}