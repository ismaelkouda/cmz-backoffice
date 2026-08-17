export class InfrastructureTypeCreateCommand {
    constructor(
        public readonly name?: string,
        public readonly description?: string,
        public readonly tag?: string
    ) {}
}
