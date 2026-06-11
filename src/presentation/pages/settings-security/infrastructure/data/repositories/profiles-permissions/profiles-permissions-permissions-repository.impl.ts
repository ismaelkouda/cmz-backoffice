import { inject, Injectable } from '@angular/core';
import { ProfilesPermissionsPermissionsEntity } from '@pages/settings-security/domain/entities/profiles-permissions/profiles-permissions-permissions.entity';
import { ProfilesPermissionsPermissionsRepository } from '@pages/settings-security/domain/repositories/profiles-permissions/profiles-permissions-permissions-repository';
import { ProfilesPermissionsPermissionsMapper } from '@pages/settings-security/infrastructure/data/mappers/profiles-permissions/profiles-permissions-permissions.mapper';
import { ProfilesPermissionsPermissionsApi } from '@pages/settings-security/infrastructure/data/sources/profiles-permissions/profiles-permissions-permissions.api';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProfilesPermissionsPermissionsRepositoryImpl implements ProfilesPermissionsPermissionsRepository {
    private readonly api = inject(ProfilesPermissionsPermissionsApi);
    private readonly mapper = inject(ProfilesPermissionsPermissionsMapper);

    execute(
        options?: FetchOptions
    ): Observable<ProfilesPermissionsPermissionsEntity> {
        return this.api
            .execute(options)
            .pipe(map((dto) => this.mapper.mapFromDto(dto)));
    }
}
