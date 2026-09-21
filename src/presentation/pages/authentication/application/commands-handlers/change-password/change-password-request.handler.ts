import { changePasswordRequestCommandMapper } from '@presentation/pages/authentication/application/commands-mappers/change-password/change-password-request.mapper';
import { Injectable, inject } from '@angular/core';
import { ChangePasswordResponseEntity } from '@presentation/pages/authentication/domain/entities/change-password/change-password-response.entity';
import { ChangePasswordRequestCommand } from '@presentation/pages/authentication/application/commands/change-password/change-password-request.command';
import { Observable } from 'rxjs';
import { ChangePasswordUseCase } from '@presentation/pages/authentication/application/use-cases/change-password/change-password.use-case';

@Injectable({ providedIn: 'root' })
export class ChangePasswordRequestHandler {
    private readonly useCase = inject(ChangePasswordUseCase);

    execute(
        command: ChangePasswordRequestCommand
    ): Observable<ChangePasswordResponseEntity> {
        return this.useCase.execute(
            changePasswordRequestCommandMapper(command)
        );
    }
}
