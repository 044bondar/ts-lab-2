export interface Identifiable {
    id: string;
}

export class Library<T extends Identifiable> {
    private items: T[] = [];

    constructor(initialItems: T[] = []) {
        this.items = [...initialItems];
    }

    public add(item: T): void {
        this.items.push(item);
    }

    public remove(id: string): boolean {
        const initialLen = this.items.length;
        this.items = this.items.filter((item) => item.id !== id);
        return this.items.length < initialLen;
    }

    public findById(id: string): T | undefined {
        return this.items.find((item) => item.id === id);
    }

    public getAll(): T[] {
        return [...this.items];
    }

    public count(): number {
        return this.items.length;
    }
}