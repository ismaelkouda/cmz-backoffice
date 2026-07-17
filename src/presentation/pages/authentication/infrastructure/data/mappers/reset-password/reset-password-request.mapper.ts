import { ResetPasswordRequestValidateContract } from '@presentation/pages/authentication/domain/contracts/reset-password/reset-password-request.validate-contract';
import { ResetPasswordRequestApiDto } from '@presentation/pages/authentication/infrastructure/api/dto/reset-password/reset-password-request-api.dto';

export function resetPasswordRequestMapper(
    validContract: ResetPasswordRequestValidateContract
): ResetPasswordRequestApiDto {
    return {
        token: validContract.token,
        email: validContract.email,
        password: validContract.password,
        confirmPassword: validContract.confirmPassword,
    };
}
