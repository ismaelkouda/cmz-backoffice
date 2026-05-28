import { Injectable, inject } from '@angular/core';
import { UsersUpdateCommand } from '@pages/settings-security/application/commands/users/users-update.command';
import { UsersUseCase } from '@pages/settings-security/application/use-cases/users/users.use-case';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UsersUpdateHandler {
    private readonly useCase = inject(UsersUseCase);

    execute(command: UsersUpdateCommand): Observable<SimpleResponseDto<void>> {
        return this.useCase.update({
            uniqId: command.uniqId,
            firstName: command.firstName,
            lastName: command.lastName,
            email: command.email,
            phone: command.phone,
            profile: command.profile,
            // role: command.role,
        });
    }
}
