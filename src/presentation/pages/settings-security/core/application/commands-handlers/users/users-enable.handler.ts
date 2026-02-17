import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { UsersEnableCommand } from '@presentation/pages/settings-security/core/application/commands/users/users-enable.command';
import { UsersUseCase } from '@presentation/pages/settings-security/core/application/use-cases/users/users.use-case';

@Injectable({ providedIn: 'root' })
export class UsersEnableHandler {
    constructor(private readonly useCase: UsersUseCase) {}

    execute(command: UsersEnableCommand): Observable<SimpleResponseDto<void>> {
        return this.useCase.enable({
            uniqId: command.uniqId,
        });
    }
}
