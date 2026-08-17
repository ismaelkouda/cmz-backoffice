export class LegalNoticeCreateCommand {
    constructor(
        public readonly version: string,
        public readonly content: string
    ) {}
}
