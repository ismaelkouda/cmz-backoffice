import { Injectable, inject } from '@angular/core';
import { MunicipalitiesSelectEntity } from '@pages/administrative-boundary/domain/entities/municipalities/municipalities-select.entity';
import { MunicipalitiesSelectRepository } from '@pages/administrative-boundary/domain/repositories/municipalities/municipalities-select-repository';
import { MunicipalitiesSelectMapper } from '@pages/administrative-boundary/infrastructure/data/mappers/municipalities/municipalities-select.mapper';
import { MunicipalitiesSelectApi } from '@pages/administrative-boundary/infrastructure/data/sources/municipalities/municipalities-select.api';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MunicipalitiesSelectRepositoryImpl implements MunicipalitiesSelectRepository {
    private readonly api = inject(MunicipalitiesSelectApi);
    private readonly mapper = inject(MunicipalitiesSelectMapper);

    execute(options?: FetchOptions): Observable<MunicipalitiesSelectEntity[]> {
        return this.api
            .readAll(options)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }
}
