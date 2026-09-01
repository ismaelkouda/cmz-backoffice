import { ForgotPasswordProps } from '@presentation/pages/authentication/domain/interfaces/forgot-password/forgot-password-props.interface';

export class ForgotPasswordResponseEntity implements ForgotPasswordProps {
    constructor(public readonly props: ForgotPasswordProps) {}

    get retryAfter(): number {
        return this.props.retryAfter;
    }
}
