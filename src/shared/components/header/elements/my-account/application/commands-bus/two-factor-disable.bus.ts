import { Observable } from 'rxjs';
import { TwoFactorDisableHandler } from '../commands-handlers/two-factor-disable.handler';
import { MessageEntity } from '@shared/domain/entities/message.entity';
import { TwoFactorDisableCommand } from '../commands/two-factor-disable.command';
import { inject } from '@angular/core';

export class TwoFactorDisableBus {
    private readonly passwordChangeHandler = inject(TwoFactorDisableHandler);

    dispatch<T>(command: T): Observable<MessageEntity> {
        if (command instanceof TwoFactorDisableCommand) {
            return this.passwordChangeHandler.execute(command);
        }
        throw new Error('No handler found for command');
    }
}
