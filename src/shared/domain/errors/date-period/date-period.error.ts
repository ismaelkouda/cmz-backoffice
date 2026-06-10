import { DomainError } from '@shared/domain/errors/domain-error.abstract';

export class InvalidDateRangeError extends DomainError {
    readonly code = 'INVALID_DATE_RANGE';
    readonly messageKey = 'COMMON.INVALID_DATE_RANGE';
    readonly statusCode = 422;

    constructor(message?: string) {
        console.log('fzgefefezfzef');
        super(message || 'INVALID_DATE_RANGE');
    }
}

export class InvalidStartDateError extends DomainError {
    readonly code = 'INVALID_START_DATE';
    readonly messageKey = 'COMMON.INVALID_START_DATE';
    readonly statusCode = 422;

    constructor(message?: string) {
        super(message || 'INVALID_START_DATE');
    }
}

export class InvalidEndDateError extends DomainError {
    readonly code = 'INVALID_END_DATE';
    readonly messageKey = 'COMMON.INVALID_END_DATE';
    readonly statusCode = 422;

    constructor(message?: string) {
        super(message || 'INVALID_END_DATE');
    }
}
