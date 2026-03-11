import { inject, Injectable } from '@angular/core';
import { RolesSelectEntity } from '@pages/team-organization/domain/entities/participants/roles-select.entity';
import { RolesSelectRepository } from '@pages/team-organization/domain/repositories/participants/roles-select-repository';
import { RolesSelectMapper } from '@pages/team-organization/infrastructure/data/mappers/participants/roles-select.mapper';
import { RolesSelectApi } from '@pages/team-organization/infrastructure/data/sources/participants/roles-select.api';
import { map, Observable } from 'rxjs';

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
