export class ProfilesPermissionsUsersReassignCommand {
    constructor(
        public readonly uniqId: string,
        public readonly users: string[]
    ) {}
}
