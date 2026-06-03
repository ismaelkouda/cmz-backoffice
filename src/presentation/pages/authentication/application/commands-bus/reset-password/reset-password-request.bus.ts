import { Injectable, inject } from '@angular/core';
import { ResetPasswordResponseEntity } from '@presentation/pages/authentication/domain/entities/reset-password/reset-password-response.entity';
import { ResetPasswordRequestCommand } from '@presentation/pages/authentication/application/commands/reset-password/reset-password-request.command';
import { ResetPasswordRequestHandler } from '@presentation/pages/authentication/application/commands-handlers/reset-password/reset-password-request.handler';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ResetPasswordRequestBus {
    private readonly resetPasswordHandler = inject(ResetPasswordRequestHandler);

    dispatch<T>(command: T): Observable<ResetPasswordResponseEntity> {
        if (command instanceof ResetPasswordRequestCommand) {
            return this.resetPasswordHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
