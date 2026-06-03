import { DomainError } from '@shared/domain/errors/domain-error.abstract';

export class UnauthorizedError extends DomainError {
    readonly code = 'UNAUTHORIZED';
    readonly messageKey = 'COMMON.ERROR.UNAUTHORIZED';
    readonly statusCode = 401;
    constructor() {
        super('Unauthorized');
    }
}
