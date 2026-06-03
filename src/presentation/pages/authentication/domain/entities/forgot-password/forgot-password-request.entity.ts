import { ForgotPasswordRequestVo } from '@presentation/pages/authentication/domain/value-objects/forgot-password/forgot-password-request.vo';
import { ForgotPasswordRequestProps } from '@presentation/pages/authentication/domain/props/forgot-password/forgot-password-request.props';

export class ForgotPasswordRequestEntity {
    constructor(public readonly props: ForgotPasswordRequestProps) {}

    static fromVo(vo: ForgotPasswordRequestVo): ForgotPasswordRequestEntity {
        return new ForgotPasswordRequestEntity(vo.props);
    }
}
