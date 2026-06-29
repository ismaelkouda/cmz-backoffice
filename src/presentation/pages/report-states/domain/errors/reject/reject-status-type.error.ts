import { DomainError } from '@shared/domain/errors/domain-error.abstract';

export class StatusTypeRequiredError extends DomainError {
    readonly code = 'STATUS_TYPE_REQUIRED';
    readonly messageKey = 'REPORT_STATES.REJECT.ERROR.STATUS_TYPE.REQUIRED';
    readonly statusCode = 422;
    constructor(message?: string) {
        super(message || 'status type is required');
    }
}
