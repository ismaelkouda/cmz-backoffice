import { Injectable, inject } from '@angular/core';
import { RegionsSelectEntity } from '@presentation/pages/administrative-boundary/core/domain/entities/regions/regions-select.entity';
import { Observable, map } from 'rxjs';
import { RegionsSelectRepository } from '../../../../core/domain/repositories/regions/regions-select-repository';
import { RegionsSelectMapper } from '../../mappers/regions/regions-select.mapper';
import { RegionsSelectApi } from '../../sources/regions/regions-select.api';

@Injectable({ providedIn: 'root' })
export class RegionsSelectRepositoryImpl implements RegionsSelectRepository {
    private readonly api = inject(RegionsSelectApi);
    private readonly mapper = inject(RegionsSelectMapper);

    readAll(): Observable<Array<RegionsSelectEntity>> {
        return this.api
            .readAll()
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }
}
