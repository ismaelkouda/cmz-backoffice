import { LoginRequestProps } from '@presentation/pages/authentication/domain/props/login-request.props';
import { LoginRequestDto } from '@presentation/pages/authentication/application/dto/login-request.dto';
import { validateLoginRequest } from '@presentation/pages/authentication/application/validators/login-request.validator';

export class LoginRequestVo {
    private constructor(public readonly props: LoginRequestProps) {}

    static fromDto(dto: LoginRequestDto): LoginRequestVo {
        validateLoginRequest(dto.email);

        return new LoginRequestVo({
            email: dto.email.trim(),
            password: dto.password,
        });
    }
}
