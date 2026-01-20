import { Injectable, inject } from '@angular/core';
import { RegionsFindoneEntity } from '@presentation/pages/administrative-boundary/core/domain/entities/regions/regions-findone.entity';
import { RegionsFindoneRepository } from '@presentation/pages/administrative-boundary/core/domain/repositories/regions/regions-findone-repository';
import { RegionsFindoneFilter } from '@presentation/pages/administrative-boundary/core/domain/value-objects/regions/regions-findone-filter.vo';
import { RegionsFindoneApi } from '@presentation/pages/administrative-boundary/infrastructure/data/sources/regions/regions-findone.api';
import { Observable, map } from 'rxjs';
import { RegionsFindoneMapper } from '../../mappers/regions/regions-findone.mapper';

@Injectable({ providedIn: 'root' })
export class RegionsFindoneRepositoryImpl implements RegionsFindoneRepository {
    private readonly api = inject(RegionsFindoneApi);
    private readonly mapper = inject(RegionsFindoneMapper);

    read(filter: RegionsFindoneFilter | null): Observable<RegionsFindoneEntity> {
        return this.api
            .read(filter?.toDto() || { code: '' })
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }
}
