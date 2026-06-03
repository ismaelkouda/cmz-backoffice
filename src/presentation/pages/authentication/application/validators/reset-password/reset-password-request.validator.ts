import { PasswordRequiredError } from '@shared/domain/errors/validation/password-required.error';
import { ConfirmPasswordRequiredError } from '@shared/domain/errors/validation/confirm-password-required.error';
import { isMatchConfirmPassword } from '@shared/domain/utils/match-confirm-password.util';
import { ConfirmPasswordNoMatchError } from '@shared/domain/errors/validation/confirm-password.error';

export function validateResetPasswordRequest(
    password: string | null | undefined,
    confirmPassword: string | null | undefined
): void {
    if (!password) {
        throw new PasswordRequiredError();
    }
    if (!confirmPassword) {
        throw new ConfirmPasswordRequiredError();
    }
    if (!isMatchConfirmPassword(password, confirmPassword)) {
        throw new ConfirmPasswordNoMatchError();
    }
}
