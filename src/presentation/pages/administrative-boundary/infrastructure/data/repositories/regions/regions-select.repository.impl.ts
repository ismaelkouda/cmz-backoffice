import { Injectable, inject } from '@angular/core';
import { RegionsSelectEntity } from '@pages/administrative-boundary/domain/entities/regions/regions-select.entity';
import { RegionsSelectRepository } from '@pages/administrative-boundary/domain/repositories/regions/regions-select-repository';
import { RegionsSelectMapper } from '@pages/administrative-boundary/infrastructure/data/mappers/regions/regions-select.mapper';
import { RegionsSelectApi } from '@pages/administrative-boundary/infrastructure/data/sources/regions/regions-select.api';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RegionsSelectRepositoryImpl implements RegionsSelectRepository {
    private readonly api = inject(RegionsSelectApi);
    private readonly mapper = inject(RegionsSelectMapper);

    execute(options?: FetchOptions): Observable<RegionsSelectEntity[]> {
        return this.api
            .readAll(options)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }
}
