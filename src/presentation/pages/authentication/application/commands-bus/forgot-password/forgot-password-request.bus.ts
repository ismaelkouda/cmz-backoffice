import { Injectable, inject } from '@angular/core';
import { ForgotPasswordResponseEntity } from '@presentation/pages/authentication/domain/entities/forgot-password/forgot-password-response.entity';
import { ForgotPasswordRequestCommand } from '@presentation/pages/authentication/application/commands/forgot-password/forgot-password-request.command';
import { ForgotPasswordRequestHandler } from '@presentation/pages/authentication/application/commands-handlers/forgot-password/forgot-password-request.handler';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ForgotPasswordRequestBus {
    private readonly handler = inject(ForgotPasswordRequestHandler);

    dispatch<T>(command: T): Observable<ForgotPasswordResponseEntity> {
        if (command instanceof ForgotPasswordRequestCommand) {
            return this.handler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
