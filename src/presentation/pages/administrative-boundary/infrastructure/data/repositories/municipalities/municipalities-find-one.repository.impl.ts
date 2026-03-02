import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { MunicipalitiesFindOneFilterEntity } from '@presentation/pages/administrative-boundary/domain/entities/municipalities/municipalities-find-one-filter.entity';
import { MunicipalitiesFindOneEntity } from '@presentation/pages/administrative-boundary/domain/entities/municipalities/municipalities-find-one.entity';
import { MunicipalitiesFindOneRepository } from '@presentation/pages/administrative-boundary/domain/repositories/municipalities/municipalities-find-one-repository';
import { municipalitiesFindOneFilterMapper } from '@presentation/pages/administrative-boundary/infrastructure/data/mappers/municipalities/municipalities-find-one-filter.mapper';
import { MunicipalitiesFindOneMapper } from '@presentation/pages/administrative-boundary/infrastructure/data/mappers/municipalities/municipalities-find-one.mapper';
import { MunicipalitiesFindOneApi } from '@presentation/pages/administrative-boundary/infrastructure/data/sources/municipalities/municipalities-find-one.api';

@Injectable({ providedIn: 'root' })
export class MunicipalitiesFindOneRepositoryImpl implements MunicipalitiesFindOneRepository {
    private readonly api = inject(MunicipalitiesFindOneApi);
    private readonly mapper = inject(MunicipalitiesFindOneMapper);

    execute(
        filter: MunicipalitiesFindOneFilterEntity
    ): Observable<MunicipalitiesFindOneEntity> {
        const paramsDto = municipalitiesFindOneFilterMapper(filter);
        return this.api
            .read(paramsDto)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }
}
