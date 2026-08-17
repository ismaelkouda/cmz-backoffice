export class SiteGroupUpdateCommand {
    constructor(
        public readonly uniqId: string,
        public readonly code: string | undefined,
        public readonly name: string | undefined,
        public readonly description: string | undefined,
        public readonly color: string | undefined
    ) {}
}
