import { TimestampStyle } from "../types/Formatting";

export function formatTimestamp(timestamp: number, style: TimestampStyle): string {
    return `<t:${timestamp}${style}>`;
}