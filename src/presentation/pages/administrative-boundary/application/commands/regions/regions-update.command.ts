export class RegionsUpdateCommand {
    constructor(
        public readonly uniqId: string,
        public readonly code: string,
        public readonly name: string,
        public readonly description: string
    ) {}
}
