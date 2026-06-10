import { Injectable, Type } from '@angular/core';
import { DomainError } from '@shared/domain/errors/domain-error.abstract';

type ErrorHandler = (error: DomainError) => void;

@Injectable({ providedIn: 'root' })
export class ErrorHandlerRegistry {
    private readonly handlers = new Map<
        Type<DomainError> | string,
        ErrorHandler
    >();

    register(
        errorType: Type<DomainError> | string,
        handler: ErrorHandler
    ): void {
        this.handlers.set(errorType, handler);
    }

    private getHandler(error: DomainError): ErrorHandler | undefined {
        console.log('error', error);
        if (this.handlers.has(error.constructor as Type<DomainError>)) {
            console.log('error111', error);
            console.log('error.constructor', error.constructor);
            return this.handlers.get(error.constructor as Type<DomainError>);
        }
        if (error.code && this.handlers.has(error.code)) {
            return this.handlers.get(error.code);
        }
        return undefined;
    }

    handle(error: DomainError): void {
        const handler = this.getHandler(error);

        if (handler) {
            handler(error);
        }
    }
}
