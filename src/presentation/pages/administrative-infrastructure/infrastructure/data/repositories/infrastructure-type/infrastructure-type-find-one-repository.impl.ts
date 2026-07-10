import { inject, Injectable } from '@angular/core';
import { InfrastructureTypeFindOneFilterEntity } from '@pages/administrative-infrastructure/domain/entities/infrastructure-type/infrastructure-type-find-one-filter.entity';
import { InfrastructureTypeFindOneEntity } from '@pages/administrative-infrastructure/domain/entities/infrastructure-type/infrastructure-type-find-one.entity';
import { InfrastructureTypeFindOneRepository } from '@pages/administrative-infrastructure/domain/repositories/infrastructure-type/infrastructure-type-find-one-repository';
import { infrastructureTypeFindOneFilterMapper } from '@pages/administrative-infrastructure/infrastructure/data/mappers/infrastructure-type/infrastructure-type-find-one-filter.mapper';
import { InfrastructureTypeFindOneMapper } from '@pages/administrative-infrastructure/infrastructure/data/mappers/infrastructure-type/infrastructure-type-find-one.mapper';
import { InfrastructureTypeFindOneApi } from '@pages/administrative-infrastructure/infrastructure/data/sources/infrastructure-type/infrastructure-type-find-one.api';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class InfrastructureTypeFindOneRepositoryImpl implements InfrastructureTypeFindOneRepository {
    private readonly api = inject(InfrastructureTypeFindOneApi);
    private readonly mapper = inject(InfrastructureTypeFindOneMapper);

    execute(
        filter: InfrastructureTypeFindOneFilterEntity,
        options?: FetchOptions
    ): Observable<InfrastructureTypeFindOneEntity> {
        const paramsDto = infrastructureTypeFindOneFilterMapper(filter);
        return this.api
            .execute(paramsDto, options)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }
}
