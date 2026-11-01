import { IUser } from '../interfaces/IUser';

export class User implements IUser {
    constructor(
        public id: string,
        public name: string,
        public email: string,
        public borrowedBooks: string[] = [],
    ) {}

    public getDisplayInfo(): string {
        return `${this.id} ${this.name} (${this.email})`;
    }
}