import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { ProfilesPermissionsFindOneFilterEntity } from '@presentation/pages/settings-security/core/domain/entities/profiles-permissions/profiles-permissions-find-one-filter.entity';
import { ProfilesPermissionsFindOneEntity } from '@presentation/pages/settings-security/core/domain/entities/profiles-permissions/profiles-permissions-find-one.entity';
import { ProfilesPermissionsFindOneRepository } from '@presentation/pages/settings-security/core/domain/repositories/profiles-permissions/profiles-permissions-find-one-repository';
import { profilesPermissionsFindOneFilterMapper } from '@presentation/pages/settings-security/infrastructure/data/mappers/profiles-permissions/profiles-permissions-find-one-filter.mapper';
import { ProfilesPermissionsFindOneMapper } from '@presentation/pages/settings-security/infrastructure/data/mappers/profiles-permissions/profiles-permissions-find-one.mapper';
import { ProfilesPermissionsFindOneApi } from '@presentation/pages/settings-security/infrastructure/data/sources/profiles-permissions/profiles-permissions-find-one.api';

@Injectable({ providedIn: 'root' })
export class ProfilesPermissionsFindOneRepositoryImpl implements ProfilesPermissionsFindOneRepository {
    private readonly api = inject(ProfilesPermissionsFindOneApi);
    private readonly mapper = inject(ProfilesPermissionsFindOneMapper);

    execute(
        filter?: ProfilesPermissionsFindOneFilterEntity
    ): Observable<ProfilesPermissionsFindOneEntity> {
        const paramsDto = profilesPermissionsFindOneFilterMapper(filter);
        return this.api
            .readAll(paramsDto)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }
}
