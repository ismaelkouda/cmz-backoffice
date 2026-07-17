import { LoginRequestContract } from '@presentation/pages/authentication/domain/contracts/login/login-request.contract';
import { LoginRequestValidateContract } from '@presentation/pages/authentication/domain/contracts/login/login-request.validate-contract';
import { validateLoginRequest } from '@presentation/pages/authentication/domain/validators/login/login-request.validator';

export function loginRequestVo(
    contract: LoginRequestContract
): LoginRequestValidateContract {
    validateLoginRequest(contract);
    return {
        email: contract.email.trim(),
        password: contract.password,
    };
}
