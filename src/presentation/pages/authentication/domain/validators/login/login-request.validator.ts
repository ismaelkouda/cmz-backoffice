import { EmailRequiredError } from '@shared/domain/errors/validation/email-required.error';
import { PasswordRequiredError } from '@shared/domain/errors/validation/password-required.error';
import { InvalidEmailError } from '@shared/domain/errors/validation/invalid-email.error';
import { isValidEmail } from '@shared/domain/utils/valid-email.util';
import { LoginRequestContract } from '@presentation/pages/authentication/domain/contracts/login/login-request.contract';
import { LoginRequestValidateContract } from '@presentation/pages/authentication/domain/contracts/login/login-request.validate-contract';

export function validateLoginRequest(
    contract: LoginRequestContract
): asserts contract is LoginRequestValidateContract {
    if (!contract.email?.trim()) {
        throw new EmailRequiredError();
    }
    if (!isValidEmail(contract.email.trim())) {
        throw new InvalidEmailError();
    }
    if (!contract.password) {
        throw new PasswordRequiredError(
            'AUTHENTICATION.FORM.PASSWORD.REQUIRED'
        );
    }
}
