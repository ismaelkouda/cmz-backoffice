import { Observable } from 'rxjs';
import { TwoFactorEnableHandler } from '../commands-handlers/two-factor-enable.handler';
import { MessageEntity } from '@shared/domain/entities/message.entity';
import { TwoFactorEnableCommand } from '../commands/two-factor-enable.command';
import { inject } from '@angular/core';

export class TwoFactorEnableBus {
    private readonly passwordChangeHandler = inject(TwoFactorEnableHandler);

    dispatch<T>(command: T): Observable<MessageEntity> {
        if (command instanceof TwoFactorEnableCommand) {
            return this.passwordChangeHandler.execute(command);
        }
        throw new Error('No handler found for command');
    }
}
