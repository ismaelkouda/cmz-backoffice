import { usersDisableCommandMapper } from '@pages/settings-security/application/commands-mappers/users/users-disable.mapper';
import { Injectable, inject } from '@angular/core';
import { UsersDisableCommand } from '@pages/settings-security/application/commands/users/users-disable.command';
import { UsersUseCase } from '@pages/settings-security/application/use-cases/users/users.use-case';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UsersDisableHandler {
    private readonly useCase = inject(UsersUseCase);

    execute(command: UsersDisableCommand): Observable<SimpleResponseDto<void>> {
        return this.useCase.disable(usersDisableCommandMapper(command));
    }
}
