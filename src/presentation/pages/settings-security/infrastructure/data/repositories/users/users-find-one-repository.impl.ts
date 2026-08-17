import { inject, Injectable } from '@angular/core';
import { UsersFindOneFilterEntity } from '@pages/settings-security/domain/entities/users/users-find-one-filter.entity';
import { UsersFindOneEntity } from '@pages/settings-security/domain/entities/users/users-find-one.entity';
import { UsersFindOneRepository } from '@pages/settings-security/domain/repositories/users/users-find-one-repository';
import { usersFindOneFilterMapper } from '@pages/settings-security/infrastructure/data/mappers/users/users-find-one-filter.mapper';
import { UsersFindOneMapper } from '@pages/settings-security/infrastructure/data/mappers/users/users-find-one.mapper';
import { UsersFindOneApi } from '@pages/settings-security/infrastructure/data/sources/users/users-find-one.api';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UsersFindOneRepositoryImpl implements UsersFindOneRepository {
    private readonly api = inject(UsersFindOneApi);
    private readonly mapper = inject(UsersFindOneMapper);

    execute(
        filter: UsersFindOneFilterEntity,
        options?: FetchOptions
    ): Observable<UsersFindOneEntity> {
        const paramsDto = usersFindOneFilterMapper(filter);
        return this.api
            .execute(paramsDto, options)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }
}
