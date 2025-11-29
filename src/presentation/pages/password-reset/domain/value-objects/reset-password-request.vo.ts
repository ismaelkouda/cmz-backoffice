export class ResetPasswordRequest {
    private constructor(
        public readonly password: string,
        public readonly confirmPassword: string,
        public readonly token?: string,
        public readonly email?: string
    ) {}

    static create(params: {
        password: string | null | undefined;
        confirmPassword: string | null | undefined;
        token?: string | null | undefined;
        email?: string | null | undefined;
    }): ResetPasswordRequest {
        const password = params.password ?? '';
        const confirmPassword = params.confirmPassword ?? '';
        const token = params.token?.trim();
        const email = params.email?.trim();

        if (!password) {
            throw new Error('PASSWORD_RESET.FORM.PASSWORD.REQUIRED');
        }

        if (password.length < 6) {
            throw new Error('PASSWORD_RESET.FORM.PASSWORD.MIN_LENGTH');
        }

        if (!confirmPassword) {
            throw new Error('PASSWORD_RESET.FORM.CONFIRM_PASSWORD.REQUIRED');
        }

        if (password !== confirmPassword) {
            throw new Error('PASSWORD_RESET.FORM.PASSWORD.MISMATCH');
        }

        return new ResetPasswordRequest(
            password,
            confirmPassword,
            token,
            email
        );
    }

    toDto(): {
        password: string;
        confirm_password: string;
        token?: string;
        email?: string;
    } {
        const dto: {
            password: string;
            confirm_password: string;
            token?: string;
            email?: string;
        } = {
            password: this.password,
            confirm_password: this.confirmPassword,
        };

        if (this.token) {
            dto.token = this.token;
        }

        if (this.email) {
            dto.email = this.email;
        }

        return dto;
    }
}
