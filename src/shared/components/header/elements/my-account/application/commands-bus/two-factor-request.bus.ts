import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { TwoFactorRequestHandler } from '../commands-handlers/two-factor-request.handler';
import { TwoFactorRequestCommand } from '../commands/two-factor-request.command';
import { TwoFactorRequestResultEntity } from '../../domain/entities/two-factor-request-result.entity';

export class TwoFactorRequestBus {
    private readonly passwordChangeHandler = inject(TwoFactorRequestHandler);

    dispatch<T>(command: T): Observable<TwoFactorRequestResultEntity> {
        if (command instanceof TwoFactorRequestCommand) {
            return this.passwordChangeHandler.execute(command);
        }
        throw new Error('No handler found for command');
    }
}
