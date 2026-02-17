import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { UsersDeleteCommand } from '@presentation/pages/settings-security/core/application/commands/users/users-delete.command';
import { UsersUseCase } from '@presentation/pages/settings-security/core/application/use-cases/users/users.use-case';

@Injectable({ providedIn: 'root' })
export class UsersDeleteHandler {
    constructor(private readonly useCase: UsersUseCase) {}

    execute(command: UsersDeleteCommand): Observable<SimpleResponseDto<void>> {
        return this.useCase.delete({
            uniqId: command.uniqId,
        });
    }
}
