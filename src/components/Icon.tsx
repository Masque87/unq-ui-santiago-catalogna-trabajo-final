type IconProps = {
    src: string;
    className?: string;
};

export function Icon({ src, className = '' }: IconProps) {
    const mask = `url("${src}")`;

    return (
        <span
            className={`icon ${className}`}
            style={{ maskImage: mask, WebkitMaskImage: mask }}
            aria-hidden="true"
        />
    );
}