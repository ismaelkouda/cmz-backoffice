export class ValidateOtpCommand {
    constructor(
        public readonly email: string | undefined,
        public readonly otp: string | undefined
    ) {}
}
