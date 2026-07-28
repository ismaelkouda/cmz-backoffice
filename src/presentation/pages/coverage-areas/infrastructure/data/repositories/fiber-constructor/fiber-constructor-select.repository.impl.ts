import { inject, Injectable } from '@angular/core';
import { FiberConstructorSelectRepository } from '@pages/coverage-areas/domain/repositories/fiber-constructor/fiber-constructor-select.repository';
import { FiberConstructorSelectMapper } from '@pages/coverage-areas/infrastructure/data/mappers/fiber-constructor/fiber-constructor-select.mapper';
import { FiberConstructorSelectApi } from '@pages/coverage-areas/infrastructure/data/sources/fiber-constructor/fiber-constructor-select.api';
import { SelectOption } from '@shared/domain/interfaces/select-option.interface';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FiberConstructorSelectRepositoryImpl implements FiberConstructorSelectRepository {
    private readonly api = inject(FiberConstructorSelectApi);
    private readonly mapper = inject(FiberConstructorSelectMapper);

    readAll(options?: FetchOptions): Observable<SelectOption[]> {
        return this.api
            .readAll(options)
            .pipe(map((dto) => this.mapper.mapFromDto(dto)));
    }
}
