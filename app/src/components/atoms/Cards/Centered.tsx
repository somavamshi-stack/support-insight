export const Centered = ({ children, className = "", ...rest }) => (
    <div className={`flex h-full flex-grow flex-col items-center justify-center select-none ${className}`} {...rest}>
        {children}
    </div>
);
