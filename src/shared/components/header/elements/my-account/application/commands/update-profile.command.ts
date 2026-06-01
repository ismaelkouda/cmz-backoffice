export class UpdateProfileCommand {
    readonly type = 'update-profile';

    constructor(
        public readonly id: number,
        public readonly lastName: string,
        public readonly firstName: string,
        public readonly email: string,
        public readonly phone: string
    ) {}
}
