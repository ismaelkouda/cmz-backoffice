import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TwoFactorRequestCommand } from '../commands/two-factor-request.command';
import { TwoFactorRequestResultEntity } from '../../domain/entities/two-factor-request-result.entity';
import { TwoFactorRequestUseCase } from '../use-cases/two-factor-request.use-case';

@Injectable({ providedIn: 'root' })
export class TwoFactorRequestHandler {
    private readonly useCase = inject(TwoFactorRequestUseCase);

    execute(
        command: TwoFactorRequestCommand
    ): Observable<TwoFactorRequestResultEntity> {
        return this.useCase.execute({
            userId: command.userId,
            email: command.email,
        });
    }
}
