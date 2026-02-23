export class ProfilesPermissionsUsersRemoveCommand {
    constructor(
        public readonly uniqId: string,
        public readonly users: string[]
    ) {}
}
