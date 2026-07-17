import { LoginProps } from '@presentation/pages/authentication/domain/interfaces/login/login-props.interface';
import {
    AuthToken,
    CurrentUser,
} from '@shared/domain/interfaces/current-user.interface';

export class LoginResponseEntity implements LoginProps {
    constructor(public readonly props: LoginProps) {}

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
