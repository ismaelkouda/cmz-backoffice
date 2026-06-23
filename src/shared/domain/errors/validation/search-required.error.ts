import { DomainError } from '@shared/domain/errors/domain-error.abstract';

export class SearchRequiredError extends DomainError {
    readonly code = 'SEARCH_REQUIRED';
    readonly messageKey = 'COMMON.SEARCH.REQUIRED';
    readonly statusCode = 422;
    constructor(message?: string) {
        super(message || 'Search is required');
    }
}
