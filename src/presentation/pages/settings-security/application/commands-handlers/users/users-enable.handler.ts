import { usersEnableCommandMapper } from '@pages/settings-security/application/commands-mappers/users/users-enable.mapper';
import { Injectable, inject } from '@angular/core';
import { UsersEnableCommand } from '@pages/settings-security/application/commands/users/users-enable.command';
import { UsersUseCase } from '@pages/settings-security/application/use-cases/users/users.use-case';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UsersEnableHandler {
    private readonly useCase = inject(UsersUseCase);

    execute(command: UsersEnableCommand): Observable<SimpleResponseDto<void>> {
        return this.useCase.enable(usersEnableCommandMapper(command));
    }
}
