import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { ResponsibilitiesSelectEntity } from '@presentation/pages/settings-security/core/domain/entities/users/responsibilities-select.entity';
import { ResponsibilitiesSelectRepository } from '@presentation/pages/settings-security/core/domain/repositories/users/responsibilities-select-repository';
import { ResponsibilitiesSelectMapper } from '@presentation/pages/settings-security/infrastructure/data/mappers/users/responsibilities-select.mapper';
import { ResponsibilitiesSelectApi } from '@presentation/pages/settings-security/infrastructure/data/sources/users/responsibilities-select.api';

@Injectable({ providedIn: 'root' })
export class ResponsibilitiesSelectRepositoryImpl implements ResponsibilitiesSelectRepository {
    private readonly api = inject(ResponsibilitiesSelectApi);
    private readonly mapper = inject(ResponsibilitiesSelectMapper);

    readAll(): Observable<ResponsibilitiesSelectEntity[]> {
        return this.api
            .readAll()
            .pipe(map((dtos) => this.mapper.mapFromDto(dtos)));
    }
}
