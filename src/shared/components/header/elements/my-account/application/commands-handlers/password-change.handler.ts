import { inject, Injectable } from '@angular/core';
import { PasswordChangeCommand } from '../commands/password-change.command';
import { Observable } from 'rxjs';
import { MessageEntity } from '@shared/domain/entities/message.entity';
import { PasswordChangeUseCase } from '../use-cases/password-change.use-case';

@Injectable({ providedIn: 'root' })
export class PasswordChangeHandler {
    private readonly useCase = inject(PasswordChangeUseCase);

    execute(command: PasswordChangeCommand): Observable<MessageEntity> {
        return this.useCase.execute({
            oldPassword: command.oldPassword,
            newPassword: command.newPassword,
            newPasswordConfirmation: command.newPasswordConfirmation,
        });
    }
}
