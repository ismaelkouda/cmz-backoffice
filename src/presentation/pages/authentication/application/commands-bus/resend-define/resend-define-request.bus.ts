import { Injectable, inject } from '@angular/core';
import { ResendDefineResponseEntity } from '@presentation/pages/authentication/domain/entities/resend-define/resend-define-response.entity';
import { ResendDefineRequestCommand } from '@presentation/pages/authentication/application/commands/resend-define/resend-define-request.command';
import { ResendDefineRequestHandler } from '@presentation/pages/authentication/application/commands-handlers/resend-define/resend-define-request.handler';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ResendDefineRequestBus {
    private readonly handler = inject(ResendDefineRequestHandler);

    dispatch<T>(command: T): Observable<ResendDefineResponseEntity> {
        if (command instanceof ResendDefineRequestCommand) {
            return this.handler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
