import { DomainError } from '@shared/domain/errors/domain-error.abstract';

export class TitleRequiredError extends DomainError {
    readonly code = 'TITLE_REQUIRED';
    readonly messageKey = 'COMMON.TITLE.REQUIRED';
    readonly statusCode = 422;
    constructor(message?: string) {
        super(message || 'Title is required');
    }
}
