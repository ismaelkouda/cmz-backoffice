import { DomainError } from '@shared/domain/errors/domain-error.abstract';

export class SubjectRequiredError extends DomainError {
    readonly code = 'SUBJECT_REQUIRED';
    readonly messageKey = 'COMMUNICATION.MESSAGING.FORM.ERROR.SUBJECT.REQUIRED';
    readonly statusCode = 422;
    constructor(message?: string) {
        super(message || 'subject is required');
    }
}
