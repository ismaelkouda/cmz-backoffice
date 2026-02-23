import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { ProfilesPermissionsPermissionsEntity } from '@presentation/pages/settings-security/domain/entities/profiles-permissions/profiles-permissions-permissions.entity';
import { ProfilesPermissionsPermissionsRepository } from '@presentation/pages/settings-security/domain/repositories/profiles-permissions/profiles-permissions-permissions-repository';
import { ProfilesPermissionsPermissionsMapper } from '@presentation/pages/settings-security/infrastructure/data/mappers/profiles-permissions/profiles-permissions-permissions.mapper';
import { ProfilesPermissionsPermissionsApi } from '@presentation/pages/settings-security/infrastructure/data/sources/profiles-permissions/profiles-permissions-permissions.api';

@Injectable({ providedIn: 'root' })
export class ProfilesPermissionsPermissionsRepositoryImpl implements ProfilesPermissionsPermissionsRepository {
    private readonly api = inject(ProfilesPermissionsPermissionsApi);
    private readonly mapper = inject(ProfilesPermissionsPermissionsMapper);

    execute(): Observable<ProfilesPermissionsPermissionsEntity> {
        return this.api
            .execute()
            .pipe(map((dto) => this.mapper.mapFromDto(dto)));
    }
}
