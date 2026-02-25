import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { RegionsSelectEntity } from '@presentation/pages/administrative-boundary/domain/entities/regions/regions-select.entity';
import { RegionsSelectRepository } from '@presentation/pages/administrative-boundary/domain/repositories/regions/regions-select-repository';
import { RegionsSelectMapper } from '@presentation/pages/administrative-boundary/infrastructure/data/mappers/regions/regions-select.mapper';
import { RegionsSelectApi } from '@presentation/pages/administrative-boundary/infrastructure/data/sources/regions/regions-select.api';

@Injectable({ providedIn: 'root' })
export class RegionsSelectRepositoryImpl implements RegionsSelectRepository {
    private readonly api = inject(RegionsSelectApi);
    private readonly mapper = inject(RegionsSelectMapper);

    execute(): Observable<RegionsSelectEntity[]> {
        return this.api
            .readAll()
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }
}
