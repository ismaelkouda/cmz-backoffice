export class PrivacyPolicyCreateCommand {
    constructor(
        public readonly version: string,
        public readonly content: string
    ) {}
}
