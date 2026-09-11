import { ChangePasswordRequestValidateContract } from '@presentation/pages/authentication/domain/contracts/change-password/change-password-request.validate-contract';
import { ChangePasswordRequestApiDto } from '@presentation/pages/authentication/infrastructure/api/dto/change-password/change-password-request-api.dto';

export function changePasswordRequestMapper(
    validContract: ChangePasswordRequestValidateContract
): ChangePasswordRequestApiDto {
    return {
        token: validContract.token,
        new_password: validContract.password,
        new_password_confirmation: validContract.confirmPassword,
    };
}
