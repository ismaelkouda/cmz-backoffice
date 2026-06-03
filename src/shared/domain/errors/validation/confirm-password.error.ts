import { DomainError } from '@shared/domain/errors/domain-error.abstract';

export class ConfirmPasswordNoMatchError extends DomainError {
    readonly code = 'CONFIRM_PASSWORD_NO_MATCH';
    readonly messageKey = 'AUTHENTICATION.FORM.CONFIRM_PASSWORD.NO_MATCH';
    readonly statusCode = 422;
    constructor() {
        super('Confirm password no match password');
    }
}
