import { inject, Injectable } from '@angular/core';
import { TowerTypeSelectRepository } from '@pages/coverage-areas/domain/repositories/tower-type/tower-type-select.repository';
import { TowerTypeSelectMapper } from '@pages/coverage-areas/infrastructure/data/mappers/tower-type/tower-type-select.mapper';
import { TowerTypeSelectApi } from '@pages/coverage-areas/infrastructure/data/sources/tower-type/tower-type-select.api';
import { SelectOption } from '@shared/domain/interfaces/select-option.interface';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TowerTypeSelectRepositoryImpl implements TowerTypeSelectRepository {
    private readonly api = inject(TowerTypeSelectApi);
    private readonly mapper = inject(TowerTypeSelectMapper);

    readAll(options?: FetchOptions): Observable<SelectOption[]> {
        return this.api
            .readAll(options)
            .pipe(map((dto) => this.mapper.mapFromDto(dto)));
    }
}
