export class ProfilesPermissionsUsersAssignCommand {
    constructor(
        public readonly uniqId: string,
        public readonly users: string[]
    ) {}
}
