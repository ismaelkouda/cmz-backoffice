import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { UsersUpdateCommand } from '@presentation/pages/settings-security/application/commands/users/users-update.command';
import { UsersUseCase } from '@presentation/pages/settings-security/application/use-cases/users/users.use-case';

@Injectable({ providedIn: 'root' })
export class UsersUpdateHandler {
    constructor(private readonly useCase: UsersUseCase) {}

    execute(command: UsersUpdateCommand): Observable<SimpleResponseDto<void>> {
        return this.useCase.update({
            uniqId: command.uniqId,
            firstName: command.firstName,
            lastName: command.lastName,
            email: command.email,
            phone: command.phone,
            profile: command.profile,
            responsibility: command.responsibility,
        });
    }
}
