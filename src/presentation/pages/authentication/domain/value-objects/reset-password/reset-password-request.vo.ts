import { ResetPasswordRequestProps } from '@presentation/pages/authentication/domain/props/reset-password/reset-password-request.props';
import { ResetPasswordRequestDto } from '@presentation/pages/authentication/application/dto/reset-password/reset-password-request.dto';
import { validateResetPasswordRequest } from '@presentation/pages/authentication/application/validators/reset-password/reset-password-request.validator';

export class ResetPasswordRequestVo {
    private constructor(public readonly props: ResetPasswordRequestProps) {}

    static fromDto(dto: ResetPasswordRequestDto): ResetPasswordRequestVo {
        validateResetPasswordRequest(dto.password, dto.confirmPassword);

        return new ResetPasswordRequestVo({
            password: dto.password,
            confirmPassword: dto.confirmPassword,
        });
    }
}
