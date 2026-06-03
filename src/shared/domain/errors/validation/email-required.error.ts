import { DomainError } from '@shared/domain/errors/domain-error.abstract';

export class EmailRequiredError extends DomainError {
    readonly code = 'EMAIL_REQUIRED';
    readonly messageKey = 'AUTHENTICATION.FORM.EMAIL.REQUIRED';
    readonly statusCode = 422;
    constructor() {
        super('Email is required');
    }
}
