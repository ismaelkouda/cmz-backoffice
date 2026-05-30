import { Injectable, inject } from '@angular/core';
import { UsersDeleteCommand } from '@pages/settings-security/application/commands/users/users-delete.command';
import { UsersUseCase } from '@pages/settings-security/application/use-cases/users/users.use-case';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UsersDeleteHandler {
    private readonly useCase = inject(UsersUseCase);

    execute(command: UsersDeleteCommand): Observable<SimpleResponseDto<void>> {
        return this.useCase.delete({
            uniqId: command.uniqId,
        });
    }
}
