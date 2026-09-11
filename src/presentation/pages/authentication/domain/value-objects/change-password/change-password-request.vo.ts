import { ChangePasswordRequestContract } from '@presentation/pages/authentication/domain/contracts/change-password/change-password-request.contract';
import { ChangePasswordRequestValidateContract } from '@presentation/pages/authentication/domain/contracts/change-password/change-password-request.validate-contract';
import { validateChangePasswordRequest } from '@presentation/pages/authentication/domain/validators/change-password/change-password-request.validator';

export function changePasswordRequestVo(
    contract: ChangePasswordRequestContract
): ChangePasswordRequestValidateContract {
    validateChangePasswordRequest(contract);
    return {
        token: contract.token,
        password: contract.password,
        confirmPassword: contract.confirmPassword,
    };
}
