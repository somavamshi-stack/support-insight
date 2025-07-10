export const getDelayClass = (index: number) => {
    const delayMs = index * 100;
    if (delayMs <= 75) return "delay-75";
    if (delayMs <= 100) return "delay-100";
    if (delayMs <= 150) return "delay-150";
    if (delayMs <= 200) return "delay-200";
    if (delayMs <= 300) return "delay-300";
    if (delayMs <= 500) return "delay-500";
    return "delay-[600ms]"; // Use safelist if needed
};
