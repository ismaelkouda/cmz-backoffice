import { EmailRequiredError } from '@shared/domain/errors/validation/email-required.error';
import { InvalidEmailError } from '@shared/domain/errors/validation/invalid-email.error';
import { isValidEmail } from '@shared/domain/utils/valid-email.util';
import { ForgotPasswordRequestContract } from '@presentation/pages/authentication/domain/contracts/forgot-password/forgot-password-request.contract';
import { ForgotPasswordRequestValidateContract } from '@presentation/pages/authentication/domain/contracts/forgot-password/forgot-password-request.validate-contract';

export function validateForgotPasswordRequest(
    contract: ForgotPasswordRequestContract
): asserts contract is ForgotPasswordRequestValidateContract {
    if (!contract.email?.trim()) {
        throw new EmailRequiredError();
    }
    if (!isValidEmail(contract.email.trim())) {
        throw new InvalidEmailError();
    }
}
