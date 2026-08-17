import { DomainError } from '@shared/domain/errors/domain-error.abstract';

export class ContentRequiredError extends DomainError {
    readonly code = 'CONTENT_REQUIRED';
    readonly messageKey = 'COMMUNICATION.MESSAGING.FORM.ERROR.CONTENT.REQUIRED';
    readonly statusCode = 422;
    constructor(message?: string) {
        super(message || 'content is required');
    }
}
