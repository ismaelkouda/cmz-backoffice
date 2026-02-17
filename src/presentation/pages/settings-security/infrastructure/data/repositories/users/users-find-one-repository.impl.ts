import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { UsersFindOneFilterEntity } from '@presentation/pages/settings-security/core/domain/entities/users/users-find-one-filter.entity';
import { UsersFindOneEntity } from '@presentation/pages/settings-security/core/domain/entities/users/users-find-one.entity';
import { UsersFindOneRepository } from '@presentation/pages/settings-security/core/domain/repositories/users/users-find-one-repository';
import { usersFindOneFilterMapper } from '@presentation/pages/settings-security/infrastructure/data/mappers/users/users-find-one-filter.mapper';
import { UsersFindOneMapper } from '@presentation/pages/settings-security/infrastructure/data/mappers/users/users-find-one.mapper';
import { UsersFindOneApi } from '@presentation/pages/settings-security/infrastructure/data/sources/users/users-find-one.api';

@Injectable({ providedIn: 'root' })
export class UsersFindOneRepositoryImpl implements UsersFindOneRepository {
    private readonly api = inject(UsersFindOneApi);
    private readonly mapper = inject(UsersFindOneMapper);

    execute(filter: UsersFindOneFilterEntity): Observable<UsersFindOneEntity> {
        const paramsDto = usersFindOneFilterMapper(filter);
        return this.api
            .execute(paramsDto)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }
}
