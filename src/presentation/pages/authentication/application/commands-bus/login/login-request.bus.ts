import { Injectable, inject } from '@angular/core';
import { LoginResponseEntity } from '@presentation/pages/authentication/domain/entities/login/login-response.entity';
import { LoginRequestCommand } from '@presentation/pages/authentication/application/commands/login/login-request.command';
import { LoginRequestHandler } from '@presentation/pages/authentication/application/commands-handlers/login/login-request.handler';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoginRequestBus {
    private readonly loginHandler = inject(LoginRequestHandler);

    dispatch<T>(command: T): Observable<LoginResponseEntity> {
        if (command instanceof LoginRequestCommand) {
            return this.loginHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
