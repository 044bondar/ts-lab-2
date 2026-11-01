export namespace Validation {
    export function isNotEmpty(value: string): boolean {
        return value.trim().length > 0;
    }

    export function isValidNumericId(id: string): boolean {
        return /^\d+$/.test(id.trim());
    }

    export function isValidYear(yearStr: string): boolean {
        if (!/^\d{4}$/.test(yearStr.trim())) {
            return false;
        }
        const year = parseInt(yearStr, 10);
        const currentYear = new Date().getFullYear();
        return year >= 1000 && year <= currentYear;
    }

    export function isValidEmail(email: string): boolean {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    }
}