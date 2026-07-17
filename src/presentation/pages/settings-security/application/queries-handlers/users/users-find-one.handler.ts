import { usersFindOneQueryMapper } from '@pages/settings-security/application/queries-mappers/users/users-find-one.mapper';
import { Injectable, inject } from '@angular/core';
import { UsersFindOneQuery } from '@pages/settings-security/application/queries/users/users-find-one.query';
import { UsersFindOneUseCase } from '@pages/settings-security/application/use-cases/users/users-find-one.use-case';
import { UsersFindOneEntity } from '@pages/settings-security/domain/entities/users/users-find-one.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UsersFindOneHandler {
    private readonly useCase = inject(UsersFindOneUseCase);

    execute(
        command: UsersFindOneQuery,
        options?: FetchOptions
    ): Observable<UsersFindOneEntity> {
        return this.useCase.execute(usersFindOneQueryMapper(command), options);
    }
}
