import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MessageEntity } from '@shared/domain/entities/message.entity';
import { TwoFactorDisableCommand } from '../commands/two-factor-disable.command';
import { TwoFactorDisableUseCase } from '../use-cases/two-factor-disable.use-case';

@Injectable({ providedIn: 'root' })
export class TwoFactorDisableHandler {
    private readonly useCase = inject(TwoFactorDisableUseCase);

    execute(command: TwoFactorDisableCommand): Observable<MessageEntity> {
        return this.useCase.execute({
            userId: command.userId,
            email: command.email,
        });
    }
}
