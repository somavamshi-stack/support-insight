export function formatShortDate(timestamp: string): string {
    try {
        const date = new Date(timestamp);

        const day = date.getDate().toString().padStart(2, "0"); // 15
        const month = date.toLocaleString("en-US", { month: "short" }); // Jun
        const year = date.getFullYear().toString().slice(-2); // 25

        const hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, "0");
        const isAM = hours < 12;
        const hour12 = hours % 12 === 0 ? 12 : hours % 12;
        const ampm = isAM ? "AM" : "PM";

        return `${day} ${month} ${year}, ${hour12}:${minutes} ${ampm}`;
    } catch (error) {
        return "Invalid date";
    }
}
