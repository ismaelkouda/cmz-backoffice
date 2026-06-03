import { DomainError } from '@shared/domain/errors/domain-error.abstract';

export class ConfirmPasswordRequiredError extends DomainError {
    readonly code = 'CONFIRM_PASSWORD_REQUIRED';
    readonly messageKey = 'AUTHENTICATION.FORM.CONFIRM_PASSWORD.REQUIRED';
    readonly statusCode = 422;
    constructor() {
        super('Confirm password is required');
    }
}
