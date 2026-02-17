export class ProfilesPermissionsUpdateCommand {
    constructor(
        public readonly uniqId: string,
        public readonly name: string,
        public readonly description: string,
        public readonly permissions: string[]
    ) {}
}
