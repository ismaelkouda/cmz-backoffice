import { LoginRequestProps } from '@presentation/pages/authentication/domain/props/login/login-request.props';
import { LoginRequestDto } from '@presentation/pages/authentication/application/dto/login/login-request.dto';
import { validateLoginRequest } from '@presentation/pages/authentication/application/validators/login/login-request.validator';

export class LoginRequestVo {
    private constructor(public readonly props: LoginRequestProps) {}

    static fromDto(dto: LoginRequestDto): LoginRequestVo {
        validateLoginRequest(dto);

        return new LoginRequestVo({
            email: dto.email.trim(),
            password: dto.password,
        });
    }
}
