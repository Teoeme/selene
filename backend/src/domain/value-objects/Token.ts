export class Token {

    constructor(private readonly value: string) {}

    getValue(): string {
        return this.value;
    }

    static create(value: string): Token {
        if(!value || value.trim() === '' || value.length === 0) {
            throw new Error('Token cannot be empty');
        }

        return new Token(value);
    }
}