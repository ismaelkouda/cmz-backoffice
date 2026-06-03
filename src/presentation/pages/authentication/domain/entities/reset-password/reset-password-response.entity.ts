import { ResetPasswordResponseProps } from '@presentation/pages/authentication/domain/props/reset-password/reset-password-response.props';
import {
    AuthToken,
    CurrentUser,
} from '@shared/domain/interfaces/current-user.interface';

export class ResetPasswordResponseEntity implements ResetPasswordResponseProps {
    constructor(public readonly props: ResetPasswordResponseProps) {}

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
