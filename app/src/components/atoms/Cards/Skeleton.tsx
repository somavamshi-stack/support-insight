import { Spinner } from "../Spinners";

export const Skeleton = ({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) => {
    return (
        <div className={`rounded-md bg-slate-200 ${className} animate-pulse`} {...props}>
            <Spinner />
        </div>
    );
};
