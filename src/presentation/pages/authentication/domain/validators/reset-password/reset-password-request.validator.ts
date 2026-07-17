import { GenericRequiredError } from '@shared/domain/errors/validation/generic.error';
import { PasswordRequiredError } from '@shared/domain/errors/validation/password-required.error';
import { ConfirmPasswordRequiredError } from '@shared/domain/errors/validation/confirm-password-required.error';
import { isMatchConfirmPassword } from '@shared/domain/utils/match-confirm-password.util';
import { ConfirmPasswordNoMatchError } from '@shared/domain/errors/validation/confirm-password.error';
import { ResetPasswordRequestContract } from '@presentation/pages/authentication/domain/contracts/reset-password/reset-password-request.contract';
import { ResetPasswordRequestValidateContract } from '@presentation/pages/authentication/domain/contracts/reset-password/reset-password-request.validate-contract';

export function validateResetPasswordRequest(
    contract: ResetPasswordRequestContract
): asserts contract is ResetPasswordRequestValidateContract {
    if (!contract.token) {
        throw new GenericRequiredError(
            'AUTHENTICATION.RESET_PASSWORD.TOKEN.REQUIRED'
        );
    }
    if (!contract.email) {
        throw new GenericRequiredError(
            'AUTHENTICATION.RESET_PASSWORD.EMAIL.REQUIRED'
        );
    }
    if (!contract.password) {
        throw new PasswordRequiredError();
    }
    if (!contract.confirmPassword) {
        throw new ConfirmPasswordRequiredError();
    }
    if (!isMatchConfirmPassword(contract.password, contract.confirmPassword)) {
        throw new ConfirmPasswordNoMatchError();
    }
}
