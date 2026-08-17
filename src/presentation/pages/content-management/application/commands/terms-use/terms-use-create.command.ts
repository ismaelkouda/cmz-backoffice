export class TermsUseCreateCommand {
    constructor(
        public readonly version: string,
        public readonly content: string
    ) {}
}
