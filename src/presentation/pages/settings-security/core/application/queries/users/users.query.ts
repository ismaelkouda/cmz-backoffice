export class UsersQuery {
    constructor(
        public readonly search?: string,
        public readonly profile?: string,
        public readonly responsibility?: string,
        public readonly isActive?: string
    ) {}
}
