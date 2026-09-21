import { Injectable, inject } from '@angular/core';
import { ChangePasswordResponseEntity } from '@presentation/pages/authentication/domain/entities/change-password/change-password-response.entity';
import { ChangePasswordRequestCommand } from '@presentation/pages/authentication/application/commands/change-password/change-password-request.command';
import { ChangePasswordRequestHandler } from '@presentation/pages/authentication/application/commands-handlers/change-password/change-password-request.handler';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ChangePasswordRequestBus {
    private readonly handler = inject(ChangePasswordRequestHandler);

    dispatch<T>(command: T): Observable<ChangePasswordResponseEntity> {
        if (command instanceof ChangePasswordRequestCommand) {
            return this.handler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
