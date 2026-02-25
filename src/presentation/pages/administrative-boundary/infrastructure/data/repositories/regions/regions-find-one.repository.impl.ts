import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { RegionsFindOneFilterEntity } from '@presentation/pages/administrative-boundary/domain/entities/regions/regions-find-one-filter.entity';
import { RegionsFindOneEntity } from '@presentation/pages/administrative-boundary/domain/entities/regions/regions-find-one.entity';
import { RegionsFindOneRepository } from '@presentation/pages/administrative-boundary/domain/repositories/regions/regions-find-one-repository';
import { regionsFindOneFilterMapper } from '@presentation/pages/administrative-boundary/infrastructure/data/mappers/regions/regions-find-one-filter.mapper';
import { RegionsFindOneMapper } from '@presentation/pages/administrative-boundary/infrastructure/data/mappers/regions/regions-find-one.mapper';
import { RegionsFindOneApi } from '@presentation/pages/administrative-boundary/infrastructure/data/sources/regions/regions-find-one.api';

@Injectable({ providedIn: 'root' })
export class RegionsFindOneRepositoryImpl implements RegionsFindOneRepository {
    private readonly api = inject(RegionsFindOneApi);
    private readonly mapper = inject(RegionsFindOneMapper);

    execute(
        filter: RegionsFindOneFilterEntity
    ): Observable<RegionsFindOneEntity> {
        const paramsDto = regionsFindOneFilterMapper(filter);
        return this.api
            .read(paramsDto)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }
}
