import { ForgotPasswordResponseProps } from '@presentation/pages/authentication/domain/props/forgot-password/forgot-password-response.props';
import {
    AuthToken,
    CurrentUser,
} from '@shared/domain/interfaces/current-user.interface';

export class ForgotPasswordResponseEntity implements ForgotPasswordResponseProps {
    constructor(public readonly props: ForgotPasswordResponseProps) {}

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
