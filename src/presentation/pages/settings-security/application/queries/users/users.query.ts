export class UsersQuery {
    constructor(
        public readonly search?: string,
        public readonly profile?: string,
        public readonly role?: string,
        public readonly isActive?: string
    ) {}
}
