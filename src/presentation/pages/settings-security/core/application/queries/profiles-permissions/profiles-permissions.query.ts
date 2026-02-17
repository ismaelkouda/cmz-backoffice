export class ProfilesPermissionsQuery {
    constructor(
        public readonly search?: string,
        public readonly user?: string,
        public readonly isActive?: string
    ) {}
}
