import { LoginRequestVo } from '@presentation/pages/authentication/domain/value-objects/login-request.vo';
import { LoginRequestProps } from '../props/login-request.props';

export class LoginRequestEntity {
    constructor(public readonly props: LoginRequestProps) {}

    static fromVo(vo: LoginRequestVo): LoginRequestEntity {
        return new LoginRequestEntity(vo.props);
    }
}
