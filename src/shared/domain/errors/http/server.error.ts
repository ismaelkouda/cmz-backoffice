import { DomainError } from '@shared/domain/errors/domain-error.abstract';

export class ServerError extends DomainError {
    readonly code = 'SERVER_ERROR';
    readonly messageKey = 'ERRORS.HTTP.SERVER_ERROR';
    readonly statusCode = 500;

    constructor() {
        super('ERRORS.HTTP.SERVER_ERROR');
    }
}
