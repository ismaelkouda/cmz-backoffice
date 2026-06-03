import { DomainError } from '@shared/domain/errors/domain-error.abstract';

export class InvalidCredentialsError extends DomainError {
    readonly code = 'INVALID_CREDENTIALS';
    readonly messageKey = 'AUTHENTICATION.ERROR.INVALID_CREDENTIALS';
    readonly statusCode = 401;
    constructor() {
        super('Invalid credentials');
    }
}
