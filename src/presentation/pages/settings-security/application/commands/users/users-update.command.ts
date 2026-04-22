export class UsersUpdateCommand {
    constructor(
        public readonly uniqId: string,
        public readonly firstName: string,
        public readonly lastName: string,
        public readonly email: string,
        public readonly phone: string,
        public readonly profile: string,
        public readonly role: string
    ) {}
}
