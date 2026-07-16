import { resetPasswordRequestCommandMapper } from '@presentation/pages/authentication/application/commands-mappers/reset-password/reset-password-request.mapper';
import { Injectable, inject } from '@angular/core';
import { ResetPasswordResponseEntity } from '@presentation/pages/authentication/domain/entities/reset-password/reset-password-response.entity';
import { ResetPasswordRequestCommand } from '@presentation/pages/authentication/application/commands/reset-password/reset-password-request.command';
import { Observable } from 'rxjs';
import { ResetPasswordUseCase } from '@presentation/pages/authentication/application/use-cases/reset-password/reset-password.use-case';

@Injectable({ providedIn: 'root' })
export class ResetPasswordRequestHandler {
    private readonly useCase = inject(ResetPasswordUseCase);

    execute(
        command: ResetPasswordRequestCommand
    ): Observable<ResetPasswordResponseEntity> {
        return this.useCase.execute(resetPasswordRequestCommandMapper(command));
    }
}
