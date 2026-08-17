import { inject, Injectable } from '@angular/core';
import { ProfilesPermissionsFindOneFilterEntity } from '@pages/settings-security/domain/entities/profiles-permissions/profiles-permissions-find-one-filter.entity';
import { ProfilesPermissionsFindOneEntity } from '@pages/settings-security/domain/entities/profiles-permissions/profiles-permissions-find-one.entity';
import { ProfilesPermissionsFindOneRepository } from '@pages/settings-security/domain/repositories/profiles-permissions/profiles-permissions-find-one-repository';
import { profilesPermissionsFindOneFilterMapper } from '@pages/settings-security/infrastructure/data/mappers/profiles-permissions/profiles-permissions-find-one-filter.mapper';
import { ProfilesPermissionsFindOneMapper } from '@pages/settings-security/infrastructure/data/mappers/profiles-permissions/profiles-permissions-find-one.mapper';
import { ProfilesPermissionsFindOneApi } from '@pages/settings-security/infrastructure/data/sources/profiles-permissions/profiles-permissions-find-one.api';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProfilesPermissionsFindOneRepositoryImpl implements ProfilesPermissionsFindOneRepository {
    private readonly api = inject(ProfilesPermissionsFindOneApi);
    private readonly mapper = inject(ProfilesPermissionsFindOneMapper);

    execute(
        filter?: ProfilesPermissionsFindOneFilterEntity,
        options?: FetchOptions
    ): Observable<ProfilesPermissionsFindOneEntity> {
        const paramsDto = profilesPermissionsFindOneFilterMapper(filter);
        return this.api
            .readAll(paramsDto, options)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }
}
