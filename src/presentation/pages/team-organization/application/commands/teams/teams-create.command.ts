export class TeamsCreateCommand {
    constructor(
        public readonly code: string,
        public readonly name: string,
        public readonly description: string,
        public readonly reportTypes: string[],
        public readonly operators: string[],
        public readonly permissions: string[]
    ) {}
}
