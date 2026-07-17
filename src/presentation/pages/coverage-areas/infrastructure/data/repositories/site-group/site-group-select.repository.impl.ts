import { inject, Injectable } from '@angular/core';
import { SiteGroupSelectRepository } from '@pages/coverage-areas/domain/repositories/site-group/site-group-select.repository';
import { SiteGroupSelectMapper } from '@pages/coverage-areas/infrastructure/data/mappers/site-group/site-group-select.mapper';
import { SiteGroupSelectApi } from '@pages/coverage-areas/infrastructure/data/sources/site-group/site-group-select.api';
import { SelectOption } from '@shared/domain/interfaces/select-option.interface';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SiteGroupSelectRepositoryImpl
    implements SiteGroupSelectRepository
{
    private readonly api = inject(SiteGroupSelectApi);
    private readonly mapper = inject(SiteGroupSelectMapper);

    readAll(options?: FetchOptions): Observable<SelectOption[]> {
        return this.api
            .readAll(options)
            .pipe(map((dto) => this.mapper.mapFromDto(dto)));
    }
}
