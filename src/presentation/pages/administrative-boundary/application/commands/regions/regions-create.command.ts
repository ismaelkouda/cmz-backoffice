export class RegionsCreateCommand {
    constructor(
        public readonly code: string,
        public readonly name: string,
        public readonly description: string
    ) {}
}
