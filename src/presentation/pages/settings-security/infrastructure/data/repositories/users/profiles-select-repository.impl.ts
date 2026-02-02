import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { ProfilesSelectEntity } from '@presentation/pages/settings-security/core/domain/entities/users/profiles-select.entity';
import { ProfilesSelectRepository } from '@presentation/pages/settings-security/core/domain/repositories/users/profiles-select-repository';
import { ProfilesSelectMapper } from '@presentation/pages/settings-security/infrastructure/data/mappers/users/profiles-select.mapper';
import { ProfilesSelectApi } from '@presentation/pages/settings-security/infrastructure/data/sources/users/profiles-select.api';

@Injectable({ providedIn: 'root' })
export class ProfilesSelectRepositoryImpl implements ProfilesSelectRepository {
    private readonly api = inject(ProfilesSelectApi);
    private readonly mapper = inject(ProfilesSelectMapper);

    readAll(): Observable<ProfilesSelectEntity[]> {
        return this.api
            .readAll()
            .pipe(map((dto) => this.mapper.mapFromDto(dto)));
    }
}
