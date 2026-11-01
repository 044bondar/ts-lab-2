export class StorageService {
    public static get<T>(key: string, defaultValue: T): T {
        const raw = localStorage.getItem(key);
        if (!raw) return defaultValue;
        try {
            return JSON.parse(raw) as T;
        } catch {
            return defaultValue;
        }
    }

    public static set<T>(key: string, value: T): void {
        localStorage.setItem(key, JSON.stringify(value));
    }

    public static remove(key: string): void {
        localStorage.removeItem(key);
    }

    public static clear(): void {
        localStorage.clear();
    }
}