import { inject, Injectable } from '@angular/core';
import { InfrastructureSelectRepository } from '@pages/administrative-infrastructure/domain/repositories/infrastructure/infrastructure-select.repository';
import { InfrastructureSelectMapper } from '@pages/administrative-infrastructure/infrastructure/data/mappers/infrastructure/infrastructure-select.mapper';
import { InfrastructureSelectApi } from '@pages/administrative-infrastructure/infrastructure/data/sources/infrastructure/infrastructure-select.api';
import { SelectOption } from '@shared/domain/interfaces/select-option.interface';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class InfrastructureSelectRepositoryImpl implements InfrastructureSelectRepository {
    private readonly api = inject(InfrastructureSelectApi);
    private readonly mapper = inject(InfrastructureSelectMapper);

    readAll(options?: FetchOptions): Observable<SelectOption[]> {
        return this.api
            .readAll(options)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }
}
