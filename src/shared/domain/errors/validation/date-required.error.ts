import { DomainError } from '@shared/domain/errors/domain-error.abstract';

export class StartDateRequiredError extends DomainError {
    readonly code = 'START_DATE_REQUIRED';
    readonly messageKey = 'COMMON.START_DATE.REQUIRED';
    readonly statusCode = 422;
    constructor(message?: string) {
        super(message || 'Start date is required');
    }
}
