export class Company {
    constructor(
        private readonly id: string,
        private readonly name: string,
        private readonly description: string,
        private readonly createdAt: Date,
        private readonly updatedAt: Date
    ) {}

    public getId(): string {
        return this.id;
    }

    public getName(): string {
        return this.name;
    }

    public getDescription(): string {
        return this.description;
    }

    public getCreatedAt(): Date {
        return this.createdAt;
    }

    public getUpdatedAt(): Date {
        return this.updatedAt;
    }
}