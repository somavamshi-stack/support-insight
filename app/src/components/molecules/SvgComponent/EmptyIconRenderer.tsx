const LoadingSpinner = ({ className = "h-4 w-4", fill = "currentColor" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" className={className} style={{ color: fill }}>
        <path
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="2"
            d="M12 2v4m4.2 1.8l2.9-2.9M18 12h4m-5.8 4.2l2.9 2.9M12 18v4m-7.1-2.9l2.9-2.9M2 12h4M4.9 4.9l2.9 2.9"
        >
            <animateTransform
                attributeName="transform"
                attributeType="XML"
                dur="2200ms"
                from="0 12 12"
                to="360 12 12"
                repeatCount="indefinite"
                type="rotate"
            />
        </path>
    </svg>
);

interface EmptyIconRendererProps {
    title: string;
    fill?: string;
    showIcon?: boolean;
    isError?: boolean;
    details?: React.ReactNode;
}

export const EmptyIconRenderer = ({ title, details = null, fill = "#343434", showIcon = true, isError = false }: EmptyIconRendererProps) => (
    <div className={`flex flex-col items-center justify-center p-5 ${showIcon ? "mb-5 h-96 bg-white" : "h-10"}`}>
        {showIcon && <LoadingSpinner className="mb-4 h-[18px] w-[18px]" fill={fill} />}
        <label className={`text-sm font-medium ${isError ? "text-red-600" : "text-gray-600"}`}>{title}</label>
        {details}
    </div>
);
