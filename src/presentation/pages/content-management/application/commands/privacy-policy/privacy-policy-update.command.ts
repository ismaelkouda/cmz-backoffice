export class PrivacyPolicyUpdateCommand {
    constructor(
        public readonly uniqId: string,
        public readonly version: string,
        public readonly content: string
    ) {}
}
