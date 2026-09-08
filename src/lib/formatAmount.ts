/**
 * Formats a numeric ingredient amount into a clean culinary representation.
 * Supports whole numbers, clean decimals, and common culinary vulgar fractions (¼, ½, ¾, ⅓, ⅔, ⅛, etc.).
 */
export function formatAmount(amount: number): string {
    if (!amount || amount <= 0) return '';

    // Handle floating point imprecision
    const rounded = Math.round(amount * 1000) / 1000;
    const whole = Math.floor(rounded);
    const fraction = Math.round((rounded - whole) * 1000) / 1000;

    const tolerance = 0.025;
    let fractionSymbol = '';

    if (Math.abs(fraction - 0.125) < tolerance) fractionSymbol = '⅛';
    else if (Math.abs(fraction - 0.25) < tolerance) fractionSymbol = '¼';
    else if (Math.abs(fraction - 0.333) < tolerance) fractionSymbol = '⅓';
    else if (Math.abs(fraction - 0.375) < tolerance) fractionSymbol = '⅜';
    else if (Math.abs(fraction - 0.5) < tolerance) fractionSymbol = '½';
    else if (Math.abs(fraction - 0.625) < tolerance) fractionSymbol = '⅝';
    else if (Math.abs(fraction - 0.667) < tolerance) fractionSymbol = '⅔';
    else if (Math.abs(fraction - 0.75) < tolerance) fractionSymbol = '¾';
    else if (Math.abs(fraction - 0.875) < tolerance) fractionSymbol = '⅞';

    if (fractionSymbol) {
        return whole > 0 ? `${whole} ${fractionSymbol}` : fractionSymbol;
    }

    // For other numbers, round to at most 2 decimal places
    const formatted = Math.round(amount * 100) / 100;
    return formatted.toString();
}
