import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MessageEntity } from '@shared/domain/entities/message.entity';
import { TwoFactorEnableCommand } from '../commands/two-factor-enable.command';
import { TwoFactorEnableUseCase } from '../use-cases/two-factor-enable.use-case';

@Injectable({ providedIn: 'root' })
export class TwoFactorEnableHandler {
    private readonly useCase = inject(TwoFactorEnableUseCase);

    execute(command: TwoFactorEnableCommand): Observable<MessageEntity> {
        return this.useCase.execute({
            userId: command.userId,
            email: command.email,
            code: command.code,
        });
    }
}
