import { inject, Injectable } from '@angular/core';
import { InfrastructureFindOneFilterEntity } from '@pages/administrative-infrastructure/domain/entities/infrastructure/infrastructure-find-one-filter.entity';
import { InfrastructureFindOneEntity } from '@pages/administrative-infrastructure/domain/entities/infrastructure/infrastructure-find-one.entity';
import { InfrastructureFindOneRepository } from '@pages/administrative-infrastructure/domain/repositories/infrastructure/infrastructure-find-one-repository';
import { infrastructureFindOneFilterMapper } from '@pages/administrative-infrastructure/infrastructure/data/mappers/infrastructure/infrastructure-find-one-filter.mapper';
import { InfrastructureFindOneMapper } from '@pages/administrative-infrastructure/infrastructure/data/mappers/infrastructure/infrastructure-find-one.mapper';
import { InfrastructureFindOneApi } from '@pages/administrative-infrastructure/infrastructure/data/sources/infrastructure/infrastructure-find-one.api';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class InfrastructureFindOneRepositoryImpl implements InfrastructureFindOneRepository {
    private readonly api = inject(InfrastructureFindOneApi);
    private readonly mapper = inject(InfrastructureFindOneMapper);

    execute(
        filter: InfrastructureFindOneFilterEntity,
        options?: FetchOptions
    ): Observable<InfrastructureFindOneEntity> {
        const paramsDto = infrastructureFindOneFilterMapper(filter);
        return this.api
            .execute(paramsDto, options)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }
}
