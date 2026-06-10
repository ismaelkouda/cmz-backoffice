import { DomainError } from '@shared/domain/errors/domain-error.abstract';

export class ForbiddenError extends DomainError {
    readonly code = 'FORBIDDEN';
    readonly messageKey = 'ERRORS.HTTP.FORBIDDEN';
    readonly statusCode = 403;

    constructor() {
        super('Forbidden');
    }
}
