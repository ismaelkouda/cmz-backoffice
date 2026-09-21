import { ResetPasswordRequestValidateContract } from '@presentation/pages/authentication/domain/contracts/reset-password/reset-password-request.validate-contract';
import { ResetPasswordRequestApiDto } from '@presentation/pages/authentication/infrastructure/api/dto/reset-password/reset-password-request-api.dto';

export function resetPasswordRequestMapper(
    validContract: ResetPasswordRequestValidateContract
): ResetPasswordRequestApiDto {
    return {
        token: validContract.token,
        password: validContract.password,
        password_confirmation: validContract.confirmPassword,
    };
}
