export class ForgotPasswordRequest {
    private constructor(public readonly email: string) {}

    static create(params: {
        email: string | null | undefined;
    }): ForgotPasswordRequest {
        const email = params.email?.trim() ?? '';

        if (!email) {
            throw new Error('PASSWORD_RESET.FORM.EMAIL.REQUIRED');
        }

        if (!ForgotPasswordRequest.isValidEmail(email)) {
            throw new Error('PASSWORD_RESET.FORM.EMAIL.INVALID_FORMAT');
        }

        return new ForgotPasswordRequest(email);
    }

    toDto(): { email: string } {
        return {
            email: this.email,
        };
    }

    private static isValidEmail(value: string): boolean {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }
}
