export class LoginCredentials {
    private constructor(
        public readonly email: string,
        public readonly password: string
    ) {}
    static create(params: {
        email: string | null | undefined;
        password: string | null | undefined;
    }): LoginCredentials {
        const email = params.email?.trim() ?? '';
        const password = params.password ?? '';

        if (!email) {
            throw new Error('AUTHENTICATION.FORM.EMAIL.REQUIRED');
        }

        if (!LoginCredentials.isValidEmail(email)) {
            throw new Error('AUTHENTICATION.FORM.EMAIL.INVALID_FORMAT');
        }

        if (!password) {
            throw new Error('AUTHENTICATION.FORM.PASSWORD.REQUIRED');
        }

        return new LoginCredentials(email, password);
    }
    toDto(): { email: string; password: string } {
        return {
            email: this.email,
            password: this.password,
        };
    }
    private static isValidEmail(value: string): boolean {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }
}
