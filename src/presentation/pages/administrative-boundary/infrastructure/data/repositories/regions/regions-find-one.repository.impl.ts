import { Injectable, inject } from '@angular/core';
import { RegionsFindOneFilterValidateContract } from '@presentation/pages/administrative-boundary/domain/contracts/regions/regions-find-one-filter.validate-contract';
import { RegionsFindOneEntity } from '@pages/administrative-boundary/domain/entities/regions/regions-find-one.entity';
import { RegionsFindOneRepository } from '@pages/administrative-boundary/domain/repositories/regions/regions-find-one-repository';
import { regionsFindOneFilterMapper } from '@pages/administrative-boundary/infrastructure/data/mappers/regions/regions-find-one-filter.mapper';
import { RegionsFindOneMapper } from '@pages/administrative-boundary/infrastructure/data/mappers/regions/regions-find-one.mapper';
import { RegionsFindOneApi } from '@pages/administrative-boundary/infrastructure/data/sources/regions/regions-find-one.api';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RegionsFindOneRepositoryImpl implements RegionsFindOneRepository {
    private readonly api = inject(RegionsFindOneApi);
    private readonly mapper = inject(RegionsFindOneMapper);

    execute(
        filter: RegionsFindOneFilterValidateContract,
        options?: FetchOptions
    ): Observable<RegionsFindOneEntity> {
        const paramsDto = regionsFindOneFilterMapper(filter);
        return this.api
            .read(paramsDto, options)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }
}
