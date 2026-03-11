import { inject, Injectable } from '@angular/core';
import { ProfilesPermissionsSelectEntity } from '@pages/settings-security/domain/entities/profiles-permissions/profiles-permissions-select.entity';
import { ProfilesPermissionsSelectRepository } from '@pages/settings-security/domain/repositories/profiles-permissions/profiles-permissions-select-repository';
import { ProfilesPermissionsSelectMapper } from '@pages/settings-security/infrastructure/data/mappers/profiles-permissions/profiles-permissions-select.mapper';
import { ProfilesPermissionsSelectApi } from '@pages/settings-security/infrastructure/data/sources/profiles-permissions/profiles-permissions-select.api';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProfilesPermissionsSelectRepositoryImpl implements ProfilesPermissionsSelectRepository {
    private readonly api = inject(ProfilesPermissionsSelectApi);
    private readonly mapper = inject(ProfilesPermissionsSelectMapper);

    readAll(): Observable<ProfilesPermissionsSelectEntity[]> {
        return this.api
            .readAll()
            .pipe(map((dto) => this.mapper.mapFromDto(dto)));
    }
}
