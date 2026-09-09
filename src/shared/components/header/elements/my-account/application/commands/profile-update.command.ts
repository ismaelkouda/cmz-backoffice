export class ProfileUpdateCommand {
    constructor(
        public readonly id: number,
        public readonly lastName: string,
        public readonly firstName: string,
        public readonly phone: string
    ) {}
}
