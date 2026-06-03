import { ResetPasswordRequestVo } from '@presentation/pages/authentication/domain/value-objects/reset-password/reset-password-request.vo';
import { ResetPasswordRequestProps } from '@presentation/pages/authentication/domain/props/reset-password/reset-password-request.props';

export class ResetPasswordRequestEntity {
    constructor(public readonly props: ResetPasswordRequestProps) {}

    static fromVo(vo: ResetPasswordRequestVo): ResetPasswordRequestEntity {
        return new ResetPasswordRequestEntity(vo.props);
    }
}
