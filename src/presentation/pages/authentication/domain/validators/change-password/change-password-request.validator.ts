import { GenericRequiredError } from '@shared/domain/errors/validation/generic.error';
import { PasswordRequiredError } from '@shared/domain/errors/validation/password-required.error';
import { ConfirmPasswordRequiredError } from '@shared/domain/errors/validation/confirm-password-required.error';
import { isMatchConfirmPassword } from '@shared/domain/utils/match-confirm-password.util';
import { ConfirmPasswordNoMatchError } from '@shared/domain/errors/validation/confirm-password.error';
import { ChangePasswordRequestContract } from '@presentation/pages/authentication/domain/contracts/change-password/change-password-request.contract';
import { ChangePasswordRequestValidateContract } from '@presentation/pages/authentication/domain/contracts/change-password/change-password-request.validate-contract';

export function validateChangePasswordRequest(
    contract: ChangePasswordRequestContract
): asserts contract is ChangePasswordRequestValidateContract {
    if (!contract.token) {
        throw new GenericRequiredError(
            'AUTHENTICATION.CHANGE_PASSWORD.TOKEN.REQUIRED'
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
