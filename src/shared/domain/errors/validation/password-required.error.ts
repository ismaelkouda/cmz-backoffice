import { DomainError } from '@shared/domain/errors/domain-error.abstract';

export class PasswordRequiredError extends DomainError {
    readonly code = 'PASSWORD_REQUIRED';
    readonly messageKey = 'AUTHENTICATION.FORM.PASSWORD.REQUIRED';
    readonly statusCode = 422;
    constructor() {
        super('Password is required');
    }
}
