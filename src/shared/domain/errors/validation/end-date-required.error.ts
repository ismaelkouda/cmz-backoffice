import { DomainError } from '@shared/domain/errors/domain-error.abstract';

export class EndDateRequiredError extends DomainError {
    readonly code = 'END_DATE_REQUIRED';
    readonly messageKey = 'COMMON.END_DATE.REQUIRED';
    readonly statusCode = 422;
    constructor(message?: string) {
        super(message || 'End date is required');
    }
}
