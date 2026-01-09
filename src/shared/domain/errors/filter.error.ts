export class InvalidFilterError extends Error {
    constructor(public readonly code: string) {
        super(code);
        this.name = 'InvalidFilterError';
    }
}
