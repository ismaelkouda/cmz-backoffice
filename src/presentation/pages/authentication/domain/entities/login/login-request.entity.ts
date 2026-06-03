import { LoginRequestVo } from '@presentation/pages/authentication/domain/value-objects/login/login-request.vo';
import { LoginRequestProps } from '@presentation/pages/authentication/domain/props/login/login-request.props';

export class LoginRequestEntity {
    constructor(public readonly props: LoginRequestProps) {}

    static fromVo(vo: LoginRequestVo): LoginRequestEntity {
        return new LoginRequestEntity(vo.props);
    }
}
