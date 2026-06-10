import { DomainError } from '@shared/domain/errors/domain-error.abstract';

export class TimeDurationRequiredError extends DomainError {
    readonly code = 'TIME_DURATION_REQUIRED';
    readonly messageKey = 'COMMON.TIME_DURATION.REQUIRED';
    readonly statusCode = 422;
    constructor(message?: string) {
        super(message || 'Time duration is required');
    }
}
