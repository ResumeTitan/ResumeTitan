/**
 * Date Utilities
 *
 * Helper functions for date formatting and manipulation.
 */

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

/**
 * Format a date string to "Month, Year" format
 * @example formatDate("2023-06-15") => "June, 2023"
 */
export function formatDate(date: string | Date | null | undefined): string {
    if (!date) return '';

    const d = dayjs(date);
    if (!d.isValid()) return '';

    return d.format('MMMM, YYYY');
}

/**
 * Format a date to "Month Day, Year" format
 * @example formatDateFull(new Date("2023-06-15")) => "June 15, 2023"
 */
export function formatDateFull(date: Date | string | null | undefined): string {
    if (!date) return '';

    const d = dayjs(date);
    if (!d.isValid()) return '';

    return d.format('MMMM D, YYYY');
}

/**
 * Format a date range for display
 * @example formatDateRange("2020-01", "2023-06") => "January 2020 - June 2023"
 * @example formatDateRange("2020-01", "", true) => "January 2020 - Present"
 */
export function formatDateRange(startDate: string | null | undefined, endDate: string | null | undefined, isCurrent = false): string {
    const start = startDate ? dayjs(startDate).format('MMMM YYYY') : '';
    const end = isCurrent ? 'Present' : endDate ? dayjs(endDate).format('MMMM YYYY') : '';

    if (!start && !end) return '';
    if (!start) return end;
    if (!end) return start;

    return `${start} - ${end}`;
}

/**
 * Get a date string in YYYY-MM format for input[type="month"]
 */
export function toMonthInputValue(date: string | Date | null | undefined): string {
    if (!date) return '';

    const d = dayjs(date);
    if (!d.isValid()) return '';

    return d.format('YYYY-MM');
}

/**
 * Parse a month input value to ISO date string
 */
export function fromMonthInputValue(value: string): string {
    if (!value) return '';

    const d = dayjs(value, 'YYYY-MM');
    if (!d.isValid()) return '';

    return d.format('YYYY-MM-DD');
}

/**
 * Check if a date is in the past
 */
export function isPastDate(date: string | Date): boolean {
    return dayjs(date).isBefore(dayjs(), 'day');
}

/**
 * Check if a date is in the future
 */
export function isFutureDate(date: string | Date): boolean {
    return dayjs(date).isAfter(dayjs(), 'day');
}

/**
 * Get relative time from now
 * @example getRelativeTime("2023-01-15") => "11 months ago"
 */
export function getRelativeTime(date: string | Date): string {
    return dayjs(date).fromNow();
}
