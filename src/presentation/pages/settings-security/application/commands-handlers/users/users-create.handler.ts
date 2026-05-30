import { Injectable, inject } from '@angular/core';
import { UsersCreateCommand } from '@pages/settings-security/application/commands/users/users-create.command';
import { UsersUseCase } from '@pages/settings-security/application/use-cases/users/users.use-case';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UsersCreateHandler {
    private readonly useCase = inject(UsersUseCase);

    execute(command: UsersCreateCommand): Observable<SimpleResponseDto<void>> {
        return this.useCase.create({
            firstName: command.firstName,
            lastName: command.lastName,
            email: command.email,
            phone: command.phone,
            profile: command.profile,
            // role: command.role,
        });
    }
}
