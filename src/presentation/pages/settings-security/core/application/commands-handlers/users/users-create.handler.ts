import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { UsersCreateCommand } from '@presentation/pages/settings-security/core/application/commands/users/users-create.command';
import { UsersUseCase } from '@presentation/pages/settings-security/core/application/use-cases/users/users.use-case';

@Injectable({ providedIn: 'root' })
export class UsersCreateHandler {
    constructor(private readonly useCase: UsersUseCase) {}

    execute(command: UsersCreateCommand): Observable<SimpleResponseDto<void>> {
        return this.useCase.create({
            firstName: command.firstName,
            lastName: command.lastName,
            email: command.email,
            phone: command.phone,
            profile: command.profile,
            responsibility: command.responsibility,
        });
    }
}
