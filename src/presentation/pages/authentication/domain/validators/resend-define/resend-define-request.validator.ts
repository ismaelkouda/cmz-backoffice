import { GenericRequiredError } from '@shared/domain/errors/validation/generic.error';
import { EmailRequiredError } from '@shared/domain/errors/validation/email-required.error';
import { InvalidEmailError } from '@shared/domain/errors/validation/invalid-email.error';
import { isValidEmail } from '@shared/domain/utils/valid-email.util';
import { ResendDefineRequestContract } from '@presentation/pages/authentication/domain/contracts/resend-define/resend-define-request.contract';
import { ResendDefineRequestValidateContract } from '@presentation/pages/authentication/domain/contracts/resend-define/resend-define-request.validate-contract';

export function validateResendDefineRequest(
    contract: ResendDefineRequestContract
): asserts contract is ResendDefineRequestValidateContract {
    if (!contract.token?.trim()) {
        throw new GenericRequiredError(
            'AUTHENTICATION.CHANGE_PASSWORD.TOKEN.REQUIRED'
        );
    }
    if (!contract.email?.trim()) {
        throw new EmailRequiredError();
    }
    if (!isValidEmail(contract.email.trim())) {
        throw new InvalidEmailError();
    }
}
