import { DomainError } from '@shared/domain/errors/domain-error.abstract';

export class TimeDurationInvalidError extends DomainError {
    readonly code = 'TIME_DURATION_INVALID';
    readonly messageKey = 'COMMON.TIME_DURATION.INVALID';
    readonly statusCode = 422;
    constructor(message?: string) {
        super(message || 'Time duration must be a positive number');
    }
}
