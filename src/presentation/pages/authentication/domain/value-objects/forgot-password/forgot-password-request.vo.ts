import { ForgotPasswordRequestProps } from '@presentation/pages/authentication/domain/props/forgot-password/forgot-password-request.props';
import { ForgotPasswordRequestDto } from '@presentation/pages/authentication/application/dto/forgot-password/forgot-password-request.dto';
import { validateForgotPasswordRequest } from '@presentation/pages/authentication/application/validators/forgot-password/forgot-password-request.validator';

export class ForgotPasswordRequestVo {
    private constructor(public readonly props: ForgotPasswordRequestProps) {}

    static fromDto(dto: ForgotPasswordRequestDto): ForgotPasswordRequestVo {
        validateForgotPasswordRequest(dto.email);

        return new ForgotPasswordRequestVo({
            email: dto.email.trim(),
        });
    }
}
