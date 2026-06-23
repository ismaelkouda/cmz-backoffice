import { DomainError } from '@shared/domain/errors/domain-error.abstract';

export class TypeRequiredError extends DomainError {
    readonly code = 'TYPE_REQUIRED';
    readonly messageKey = 'COMMUNICATION.MESSAGING.FORM.ERROR.TYPE.REQUIRED';
    readonly statusCode = 422;
    constructor(message?: string) {
        super(message || 'type is required');
    }
}
