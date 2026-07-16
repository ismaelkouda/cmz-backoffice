import { usersUpdateCommandMapper } from '@pages/settings-security/application/commands-mappers/users/users-update.mapper';
import { Injectable, inject } from '@angular/core';
import { UsersUpdateCommand } from '@pages/settings-security/application/commands/users/users-update.command';
import { UsersUseCase } from '@pages/settings-security/application/use-cases/users/users.use-case';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UsersUpdateHandler {
    private readonly useCase = inject(UsersUseCase);

    execute(command: UsersUpdateCommand): Observable<SimpleResponseDto<void>> {
        return this.useCase.update(usersUpdateCommandMapper(command));
    }
}
