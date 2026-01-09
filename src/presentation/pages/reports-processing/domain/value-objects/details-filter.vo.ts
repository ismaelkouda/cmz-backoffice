import { InvalidFilterError } from "@shared/domain/errors/filter.error";

export class DetailsFilter {
    private constructor(public readonly id: string) { }

    static create(id: string): DetailsFilter {
        const validId = id;

        if (!validId) {
            throw new InvalidFilterError('DASHBOARD.FILTER.ID.INVALID');
        }

        return new DetailsFilter(validId);
    }

    toDto(): Record<string, string> {
        return { id: this.id };
    }
}
