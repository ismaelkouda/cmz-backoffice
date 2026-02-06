import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { RolesSelectEntity } from '@presentation/pages/team-organization/domain/entities/participants/roles-select.entity';
import { RolesSelectRepository } from '@presentation/pages/team-organization/domain/repositories/participants/roles-select-repository';
import { RolesSelectMapper } from '@presentation/pages/team-organization/infrastructure/data/mappers/participants/roles-select.mapper';
import { RolesSelectApi } from '@presentation/pages/team-organization/infrastructure/data/sources/participants/roles-select.api';

@Injectable({ providedIn: 'root' })
export class RolesSelectRepositoryImpl implements RolesSelectRepository {
    private readonly api = inject(RolesSelectApi);
    private readonly mapper = inject(RolesSelectMapper);

    readAll(): Observable<RolesSelectEntity[]> {
        return this.api
            .readAll()
            .pipe(map((dto) => this.mapper.mapFromDto(dto)));
    }
}
