import { inject, Injectable } from '@angular/core';
import { RolesSelectEntity } from '@pages/team-organization/domain/entities/participants/roles-select.entity';
import { RolesSelectRepository } from '@pages/team-organization/domain/repositories/participants/roles-select-repository';
import { RolesSelectMapper } from '@pages/team-organization/infrastructure/data/mappers/participants/roles-select.mapper';
import { RolesSelectApi } from '@pages/team-organization/infrastructure/data/sources/participants/roles-select.api';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RolesSelectRepositoryImpl implements RolesSelectRepository {
    private readonly api = inject(RolesSelectApi);
    private readonly mapper = inject(RolesSelectMapper);

    readAll(options?: FetchOptions): Observable<RolesSelectEntity[]> {
        return this.api
            .readAll(options)
            .pipe(map((dto) => this.mapper.mapFromDto(dto)));
    }
}
