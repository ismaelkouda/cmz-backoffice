import { ResetPasswordRequestContract } from '@presentation/pages/authentication/domain/contracts/reset-password/reset-password-request.contract';
import { ResetPasswordRequestValidateContract } from '@presentation/pages/authentication/domain/contracts/reset-password/reset-password-request.validate-contract';
import { validateResetPasswordRequest } from '@presentation/pages/authentication/domain/validators/reset-password/reset-password-request.validator';

export function resetPasswordRequestVo(
    contract: ResetPasswordRequestContract
): ResetPasswordRequestValidateContract {
    validateResetPasswordRequest(contract);
    return {
        token: contract.token,
        email: contract.email,
        password: contract.password,
        confirmPassword: contract.confirmPassword,
    };
}
