import { HttpErrorResponse } from '@angular/common/http';
import { DomainError } from '@shared/domain/errors/domain-error.abstract';
import { AccountLockedError } from '@shared/domain/errors/http/account-locked.error';
import { ForbiddenError } from '@shared/domain/errors/http/forbidden.error';
import { NotFoundError } from '@shared/domain/errors/http/not-found.error';
import { ServerError } from '@shared/domain/errors/http/server.error';
import { UnauthorizedError } from '@shared/domain/errors/http/unauthorized.error';
import { UnknownError } from '@shared/domain/errors/http/unknown.error';
import { ValidationError } from '@shared/domain/errors/http/validation.error';

export function httpErrorMapper(error: HttpErrorResponse): DomainError {
    switch (error.status) {
        case 400:
            // if (error.error?.code === 'ACCOUNT_LOCKED') {
            return new AccountLockedError(error.error.message);
        // } else {
        //     return new UnknownError();
        // }

        case 401:
            return new UnauthorizedError();

        case 403:
            return new ForbiddenError();

        case 404:
            return new NotFoundError();

        case 422:
            return new ValidationError(error.error.message);

        case 500:
            return new ServerError();

        default:
            return new UnknownError();
    }
}
