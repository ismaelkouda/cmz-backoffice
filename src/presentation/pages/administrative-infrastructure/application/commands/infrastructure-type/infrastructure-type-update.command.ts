export class InfrastructureTypeUpdateCommand {
    constructor(
        public readonly uniqId?: string,
        public readonly name?: string,
        public readonly description?: string
    ) {}
}
