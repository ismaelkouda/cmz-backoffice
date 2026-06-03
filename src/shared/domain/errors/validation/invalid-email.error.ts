import { DomainError } from '@shared/domain/errors/domain-error.abstract';

export class InvalidEmailError extends DomainError {
    readonly code = 'INVALID_EMAIL';
    readonly messageKey = 'AUTHENTICATION.FORM.EMAIL.INVALID_FORMAT';
    readonly statusCode = 422;
    constructor() {
        super('Invalid email format');
    }
}
