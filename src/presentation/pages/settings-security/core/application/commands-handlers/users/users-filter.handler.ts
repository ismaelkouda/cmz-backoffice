import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Paginate } from '@shared/data/dto/simple-response.dto';

import { UsersQuery } from '@presentation/pages/settings-security/core/application/queries/users/users.query';
import { UsersUseCase } from '@presentation/pages/settings-security/core/application/use-cases/users/users.use-case';
import { UsersEntity } from '@presentation/pages/settings-security/core/domain/entities/users/users.entity';

@Injectable({ providedIn: 'root' })
export class UsersFilterHandler {
    constructor(private readonly useCase: UsersUseCase) {}

    execute(
        command: UsersQuery,
        page: string
    ): Observable<Paginate<UsersEntity>> {
        return this.useCase.execute(
            {
                search: command.search,
                profile: command.profile,
                responsibility: command.responsibility,
                isActive: command.isActive,
            },
            page
        );
    }
}
