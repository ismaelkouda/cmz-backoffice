import { Injectable, inject } from '@angular/core';
import { MunicipalitiesFindOneFilterEntity } from '@pages/administrative-boundary/domain/entities/municipalities/municipalities-find-one-filter.entity';
import { MunicipalitiesFindOneEntity } from '@pages/administrative-boundary/domain/entities/municipalities/municipalities-find-one.entity';
import { MunicipalitiesFindOneRepository } from '@pages/administrative-boundary/domain/repositories/municipalities/municipalities-find-one-repository';
import { municipalitiesFindOneFilterMapper } from '@pages/administrative-boundary/infrastructure/data/mappers/municipalities/municipalities-find-one-filter.mapper';
import { MunicipalitiesFindOneMapper } from '@pages/administrative-boundary/infrastructure/data/mappers/municipalities/municipalities-find-one.mapper';
import { MunicipalitiesFindOneApi } from '@pages/administrative-boundary/infrastructure/data/sources/municipalities/municipalities-find-one.api';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MunicipalitiesFindOneRepositoryImpl implements MunicipalitiesFindOneRepository {
    private readonly api = inject(MunicipalitiesFindOneApi);
    private readonly mapper = inject(MunicipalitiesFindOneMapper);

    execute(
        filter: MunicipalitiesFindOneFilterEntity,
        options?: FetchOptions
    ): Observable<MunicipalitiesFindOneEntity> {
        const paramsDto = municipalitiesFindOneFilterMapper(filter);
        return this.api
            .read(paramsDto, options)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }
}
