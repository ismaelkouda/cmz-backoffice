import { inject, Injectable } from '@angular/core';
import { ProfileUpdateHandler } from '../commands-handlers/profile-update.handler';
import { Observable } from 'rxjs';
import { MessageEntity } from '@shared/domain/entities/message.entity';
import { ProfileUpdateCommand } from '../commands/profile-update.command';

@Injectable({ providedIn: 'root' })
export class ProfileUpdateBus {
    private readonly passwordChangeHandler = inject(ProfileUpdateHandler);

    dispatch<T>(command: T): Observable<MessageEntity> {
        if (command instanceof ProfileUpdateCommand) {
            return this.passwordChangeHandler.execute(command);
        }
        throw new Error('No handler found for command');
    }
}
