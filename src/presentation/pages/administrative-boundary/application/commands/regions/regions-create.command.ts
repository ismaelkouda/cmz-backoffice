export class RegionsCreateCommand {
    constructor(
        public readonly code: string,
        public readonly population: number,
        public readonly infrastructure: number,
        public readonly name: string,
        public readonly description: string
    ) {}
}
