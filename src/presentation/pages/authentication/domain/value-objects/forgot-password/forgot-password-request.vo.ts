import { ForgotPasswordRequestContract } from '@presentation/pages/authentication/domain/contracts/forgot-password/forgot-password-request.contract';
import { ForgotPasswordRequestValidateContract } from '@presentation/pages/authentication/domain/contracts/forgot-password/forgot-password-request.validate-contract';
import { validateForgotPasswordRequest } from '@presentation/pages/authentication/domain/validators/forgot-password/forgot-password-request.validator';

export function forgotPasswordRequestVo(
    contract: ForgotPasswordRequestContract
): ForgotPasswordRequestValidateContract {
    validateForgotPasswordRequest(contract);
    return {
        email: contract.email.trim(),
    };
}
