import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { MunicipalitiesSelectEntity } from '@presentation/pages/administrative-boundary/domain/entities/municipalities/municipalities-select.entity';
import { MunicipalitiesSelectRepository } from '@presentation/pages/administrative-boundary/domain/repositories/municipalities/municipalities-select-repository';
import { MunicipalitiesSelectMapper } from '@presentation/pages/administrative-boundary/infrastructure/data/mappers/municipalities/municipalities-select.mapper';
import { MunicipalitiesSelectApi } from '@presentation/pages/administrative-boundary/infrastructure/data/sources/municipalities/municipalities-select.api';

@Injectable({ providedIn: 'root' })
export class MunicipalitiesSelectRepositoryImpl implements MunicipalitiesSelectRepository {
    private readonly api = inject(MunicipalitiesSelectApi);
    private readonly mapper = inject(MunicipalitiesSelectMapper);

    execute(): Observable<MunicipalitiesSelectEntity[]> {
        return this.api
            .readAll()
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }
}
