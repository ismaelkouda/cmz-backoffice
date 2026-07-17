import { ForgotPasswordRequestValidateContract } from '@presentation/pages/authentication/domain/contracts/forgot-password/forgot-password-request.validate-contract';
import { ForgotPasswordRequestApiDto } from '@presentation/pages/authentication/infrastructure/api/dto/forgot-password/forgot-password-request-api.dto';

export function forgotPasswordRequestMapper(
    validContract: ForgotPasswordRequestValidateContract
): ForgotPasswordRequestApiDto {
    return {
        email: validContract.email,
    };
}
