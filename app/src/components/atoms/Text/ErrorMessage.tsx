export const ErrorMessage = ({ id, path, errors }: any) => {
    return (
        <>
            {errors?.length > 0 && (
                <label id={id + "-error-msg"} htmlFor={path} className="block w-full text-left text-[10px] font-medium text-red-600 select-none">
                    {errors}
                </label>
            )}
        </>
    );
};
