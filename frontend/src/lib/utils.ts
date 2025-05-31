import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import type { FormatOptions } from "./types";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function calculateDeadline(
    deadlineDuration: number,
    deadlineUnit = "milliseconds"
): Date {
    switch (deadlineUnit) {
        case "milliseconds":
            return new Date(new Date().getTime() + deadlineDuration);
        case "seconds":
            return calculateDeadline(deadlineDuration * 1000);
        case "minutes":
            return calculateDeadline(deadlineDuration * 60, "seconds");
        case "hours":
            return calculateDeadline(deadlineDuration * 60, "minutes");
        case "days":
            return calculateDeadline(deadlineDuration * 24, "hours");
        case "weeks":
            return calculateDeadline(deadlineDuration * 7, "days");
        default:
            throw new Error(`Unsupported deadline unit: ${deadlineUnit}`);
    }
}

export function formatTimeRemaining(ms: number): string {
    const diffDays = Math.floor(ms / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((ms / (1000 * 60 * 60)) % 24);
    const diffMinutes = Math.floor((ms / (1000 * 60)) % 60);

    if (diffDays > 0) {
        return `${diffDays} day${diffDays === 1 ? "" : "s"} remaining`;
    }
    if (diffHours > 0) {
        return `Expires in ${diffHours} hour${
            diffHours === 1 ? "" : "s"
        }`;
    }
    if (diffMinutes > 0) {
        return `Expires in ${diffMinutes} minute${
            diffMinutes === 1 ? "" : "s"
        }`;
    }
    return "Expires very soon";
}

export function formatTimeExpired(
    ms: number,
    options?: FormatOptions
): string {
    if (options?.showSimpleExpiredLabel) {
        return "Expired";
    }

    const diffDays = Math.floor(ms / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((ms / (1000 * 60 * 60)) % 24);
    const diffMinutes = Math.floor((ms / (1000 * 60)) % 60);

    if (diffDays > 0) {
        return `Expired ${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
    }
    if (diffHours > 0) {
        return `Expired ${diffHours} hour${
            diffHours === 1 ? "" : "s"
        } ago`;
    }
    if (diffMinutes > 0) {
        return `Expired ${diffMinutes} minute${
            diffMinutes === 1 ? "" : "s"
        } ago`;
    }
    return "Expired just now";
}

export function formatDeadlineDate(
    deadline: string | Date,
    options?: FormatOptions
): string {
    const targetDate = new Date(deadline);
    const now = new Date();
    const diffTime = targetDate.getTime() - now.getTime();

    if (diffTime > 0) {
        return formatTimeRemaining(diffTime);
    } else {
        return formatTimeExpired(Math.abs(diffTime), options);
    }
}
