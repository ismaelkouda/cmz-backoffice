import { DomainError } from '@shared/domain/errors/domain-error.abstract';

export class UniqIdRequiredError extends DomainError {
    readonly code = 'UNIQ_ID_REQUIRED';
    readonly messageKey = 'COMMUNICATION.MESSAGING.FORM.ERROR.UNIQ_ID.REQUIRED';
    readonly statusCode = 422;
    constructor(message?: string) {
        super(message || 'uniqId is required');
    }
}
