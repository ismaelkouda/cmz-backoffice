import { inject } from '@angular/core';
import { PasswordChangeHandler } from '../commands-handlers/password-change.handler';
import { Observable } from 'rxjs';
import { PasswordChangeCommand } from '../commands/password-change.command';
import { MessageEntity } from '@shared/domain/entities/message.entity';

export class PasswordChangeBus {
    private readonly passwordChangeHandler = inject(PasswordChangeHandler);

    dispatch<T>(command: T): Observable<MessageEntity> {
        if (command instanceof PasswordChangeCommand) {
            return this.passwordChangeHandler.execute(command);
        }
        throw new Error('No handler found for command');
    }
}
