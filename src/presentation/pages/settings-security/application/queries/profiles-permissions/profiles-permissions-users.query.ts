export class ProfilesPermissionsUsersQuery {
    constructor(
        public readonly uniqId: string,
        public readonly search?: string,
        public readonly userEmail?: string,
        public readonly phone?: string
    ) {}
}
