import {
    AuthToken,
    CurrentUser,
} from '@shared/domain/interfaces/current-user.interface';

export interface TwoFactorChallenge {
    readonly expiredAt: string;
    readonly timeout: number;
}

export interface LoginResponseProps {
    readonly requiresTwoFactor: boolean;
    readonly challenge?: TwoFactorChallenge;
    readonly user?: CurrentUser;
    readonly token?: AuthToken;
    readonly message?: string;
}

export class LoginResponseEntity {
    private readonly props: LoginResponseProps;

    constructor(props: LoginResponseProps) {
        this.props = props;
    }

    get requiresTwoFactor(): boolean {
        return this.props.requiresTwoFactor;
    }

    get challenge(): TwoFactorChallenge | undefined {
        return this.props.challenge;
    }

    get user(): CurrentUser | undefined {
        return this.props.user;
    }

    get token(): AuthToken | undefined {
        return this.props.token;
    }

    get message(): string | undefined {
        return this.props.message;
    }
}
