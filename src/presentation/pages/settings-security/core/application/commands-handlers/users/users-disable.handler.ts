import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { UsersDisableCommand } from '@presentation/pages/settings-security/core/application/commands/users/users-disable.command';
import { UsersUseCase } from '@presentation/pages/settings-security/core/application/use-cases/users/users.use-case';

@Injectable({ providedIn: 'root' })
export class UsersDisableHandler {
    constructor(private readonly useCase: UsersUseCase) {}

    execute(command: UsersDisableCommand): Observable<SimpleResponseDto<void>> {
        return this.useCase.disable({
            uniqId: command.uniqId,
        });
    }
}
