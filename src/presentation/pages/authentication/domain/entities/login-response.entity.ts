import { LoginResponseProps } from '@presentation/pages/authentication/domain/props/login-response.props';
import {
    AuthToken,
    CurrentUser,
} from '@shared/domain/interfaces/current-user.interface';

export class LoginResponseEntity implements LoginResponseProps {
    constructor(public readonly props: LoginResponseProps) {}

    get user(): CurrentUser {
        return this.props.user;
    }

    get token(): AuthToken {
        return this.props.token;
    }

    get message(): string | undefined {
        return this.props.message;
    }
}
