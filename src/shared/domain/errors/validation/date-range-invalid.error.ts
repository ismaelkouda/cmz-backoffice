import { DomainError } from '@shared/domain/errors/domain-error.abstract';

export class DateRangeInvalidError extends DomainError {
    readonly code = 'DATE_RANGE_INVALID';
    readonly messageKey = 'COMMON.DATE_RANGE.INVALID';
    readonly statusCode = 422;
    constructor(message?: string) {
        super(message || 'Date range is invalid');
    }
}
