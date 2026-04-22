import { Injectable } from '@angular/core';
import { UsersQuery } from '@pages/settings-security/application/queries/users/users.query';
import { UsersUseCase } from '@pages/settings-security/application/use-cases/users/users.use-case';
import { UsersEntity } from '@pages/settings-security/domain/entities/users/users.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UsersHandler {
    constructor(private readonly useCase: UsersUseCase) {}

    execute(
        command: UsersQuery,
        page: string
    ): Observable<Paginate<UsersEntity>> {
        return this.useCase.execute(
            {
                search: command.search,
                profile: command.profile,
                role: command.role,
                isActive: command.isActive,
            },
            page
        );
    }
}
