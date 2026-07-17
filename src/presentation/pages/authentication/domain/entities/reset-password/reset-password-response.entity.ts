import { ResetPasswordProps } from '@presentation/pages/authentication/domain/interfaces/reset-password/reset-password-props.interface';
import {
    AuthToken,
    CurrentUser,
} from '@shared/domain/interfaces/current-user.interface';

export class ResetPasswordResponseEntity implements ResetPasswordProps {
    constructor(public readonly props: ResetPasswordProps) {}

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
