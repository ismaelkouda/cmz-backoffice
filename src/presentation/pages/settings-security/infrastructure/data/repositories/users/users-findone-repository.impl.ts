import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { UsersFindOneFilterEntity } from '@presentation/pages/settings-security/core/domain/entities/users/users-findone-filter.entity';
import { UsersFindOneEntity } from '@presentation/pages/settings-security/core/domain/entities/users/users-findone.entity';
import { UsersFindonRepository } from '@presentation/pages/settings-security/core/domain/repositories/users/users-findone-repository';
import { usersFindOneFilterMapper } from '@presentation/pages/settings-security/infrastructure/data/mappers/users/users-findone-filter.mapper';
import { UsersFindonMapper } from '@presentation/pages/settings-security/infrastructure/data/mappers/users/users-findone.mapper';
import { UsersFindonApi } from '@presentation/pages/settings-security/infrastructure/data/sources/users/users-findone.api';

@Injectable({ providedIn: 'root' })
export class UsersFindonRepositoryImpl implements UsersFindonRepository {
    private readonly api = inject(UsersFindonApi);
    private readonly mapper = inject(UsersFindonMapper);

    read(filter: UsersFindOneFilterEntity): Observable<UsersFindOneEntity> {
        const paramsDto = usersFindOneFilterMapper(filter);
        return this.api
            .read(paramsDto)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }
}
