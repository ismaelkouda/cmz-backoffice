import { Injectable, inject } from '@angular/core';
import { UsersQuery } from '@pages/settings-security/application/queries/users/users.query';
import { UsersUseCase } from '@pages/settings-security/application/use-cases/users/users.use-case';
import { UsersEntity } from '@pages/settings-security/domain/entities/users/users.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UsersHandler {
    private readonly useCase = inject(UsersUseCase);

    execute(
        command: UsersQuery,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<UsersEntity>> {
        return this.useCase.execute(
            {
                search: command.search,
                profile: command.profile,
                role: command.role,
                isActive: command.isActive,
            },
            page,
            options
        );
    }
}
