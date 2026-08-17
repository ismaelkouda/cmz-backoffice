import { ForgotPasswordProps } from '@presentation/pages/authentication/domain/interfaces/forgot-password/forgot-password-props.interface';
import {
    AuthToken,
    CurrentUser,
} from '@shared/domain/interfaces/current-user.interface';

export class ForgotPasswordResponseEntity implements ForgotPasswordProps {
    constructor(public readonly props: ForgotPasswordProps) {}

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
