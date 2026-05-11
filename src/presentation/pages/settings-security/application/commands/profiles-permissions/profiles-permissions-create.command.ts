export class ProfilesPermissionsCreateCommand {
    constructor(
        public readonly name: string,
        public readonly description: string,
        public readonly permissions: Record<string, string[]>
    ) {}
}
