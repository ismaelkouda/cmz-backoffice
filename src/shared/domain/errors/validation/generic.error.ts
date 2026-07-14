import { DomainError } from '@shared/domain/errors/domain-error.abstract';

export class GenericRequiredError extends DomainError {
    readonly code = 'COMMON_REQUIRED';
    readonly messageKey = 'COMMON.ERROR.REQUIRED';
    readonly statusCode = 422;
    constructor(message?: string) {
        super(message || 'Field is required');
    }
}
