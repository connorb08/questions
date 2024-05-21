export const classNames = (...classes: string[]) =>
    classes.filter(Boolean).join(" ");

export function getMidnightEastern() {
    // Create a new Date object if no date is provided
    const currentDate = new Date();

    // Get the current offset in minutes
    const offset = currentDate.getTimezoneOffset();

    // Calculate the timezone offset for Eastern Time
    // EST (UTC-5) and EDT (UTC-4) depend on Daylight Saving Time
    const january = new Date(currentDate.getFullYear(), 0, 1);
    const july = new Date(currentDate.getFullYear(), 6, 1);
    const isDST =
        currentDate.getTimezoneOffset() <
        Math.max(january.getTimezoneOffset(), july.getTimezoneOffset());
    const easternOffset = isDST ? -240 : -300; // EDT is -240 minutes, EST is -300 minutes

    // Calculate the difference between current offset and Eastern Time offset
    const offsetDifference = easternOffset - offset;

    // Set the time to midnight Eastern Time
    currentDate.setUTCHours(24 + offsetDifference / 60, 0, 0, 0);

    return currentDate;
}
