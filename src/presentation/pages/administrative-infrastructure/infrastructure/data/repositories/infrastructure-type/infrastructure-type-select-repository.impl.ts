import { inject, Injectable } from '@angular/core';
import { InfrastructureTypeSelectEntity } from '@pages/administrative-infrastructure/domain/entities/infrastructure-type/infrastructure-type-select.entity';
import { InfrastructureTypeSelectRepository } from '@pages/administrative-infrastructure/domain/repositories/infrastructure-type/infrastructure-type-select-repository';
import { InfrastructureTypeSelectMapper } from '@pages/administrative-infrastructure/infrastructure/data/mappers/infrastructure-type/infrastructure-type-select.mapper';
import { InfrastructureTypeSelectApi } from '@pages/administrative-infrastructure/infrastructure/data/sources/infrastructure-type/infrastructure-type-select.api';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class InfrastructureTypeSelectRepositoryImpl implements InfrastructureTypeSelectRepository {
    private readonly api = inject(InfrastructureTypeSelectApi);
    private readonly mapper = inject(InfrastructureTypeSelectMapper);

    readAll(
        options?: FetchOptions
    ): Observable<InfrastructureTypeSelectEntity[]> {
        return this.api
            .readAll(options)
            .pipe(map((dto) => this.mapper.mapFromDto(dto)));
    }
}
