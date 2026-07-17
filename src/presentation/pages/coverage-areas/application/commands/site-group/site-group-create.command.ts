export class SiteGroupCreateCommand {
    constructor(
        public readonly code: string | undefined,
        public readonly name: string | undefined,
        public readonly description: string | undefined
    ) {}
}
