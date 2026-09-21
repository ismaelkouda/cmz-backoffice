import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TwoFactorRequestHandler } from '../commands-handlers/two-factor-request.handler';
import { TwoFactorRequestCommand } from '../commands/two-factor-request.command';
import { TwoFactorRequestResultEntity } from '../../domain/entities/two-factor-request-result.entity';

@Injectable({ providedIn: 'root' })
export class TwoFactorRequestBus {
    private readonly twoFactorRequestHandler = inject(TwoFactorRequestHandler);

    dispatch<T>(command: T): Observable<TwoFactorRequestResultEntity> {
        if (command instanceof TwoFactorRequestCommand) {
            return this.twoFactorRequestHandler.execute(command);
        }
        throw new Error('No handler found for command');
    }
}
