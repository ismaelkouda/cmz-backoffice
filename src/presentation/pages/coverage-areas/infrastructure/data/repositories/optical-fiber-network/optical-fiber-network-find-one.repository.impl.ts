import { inject, Injectable } from '@angular/core';
import { OpticalFiberNetworkFindOneEntity } from '@pages/coverage-areas/domain/entities/optical-fiber-network/optical-fiber-network-find-one.entity';
import { OpticalFiberNetworkFindOneRepository } from '@pages/coverage-areas/domain/repositories/optical-fiber-network/optical-fiber-network-find-one.repository';
import { opticalFiberNetworkFindOneFilterMapper } from '@pages/coverage-areas/infrastructure/data/mappers/optical-fiber-network/optical-fiber-network-find-one-filter.mapper';
import { OpticalFiberNetworkFindOneMapper } from '@pages/coverage-areas/infrastructure/data/mappers/optical-fiber-network/optical-fiber-network-find-one.mapper';
import { OpticalFiberNetworkFindOneApi } from '@pages/coverage-areas/infrastructure/data/sources/optical-fiber-network/optical-fiber-network-find-one.api';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { map, Observable } from 'rxjs';
import { OpticalFiberNetworkFindOneFilterValidateContract } from '@pages/coverage-areas/domain/contracts/optical-fiber-network/optical-fiber-network-find-one-filter.validate-contract';

@Injectable({ providedIn: 'root' })
export class OpticalFiberNetworkFindOneRepositoryImpl implements OpticalFiberNetworkFindOneRepository {
    private readonly api = inject(OpticalFiberNetworkFindOneApi);
    private readonly mapper = inject(OpticalFiberNetworkFindOneMapper);

    execute(
        validContract: OpticalFiberNetworkFindOneFilterValidateContract,
        options?: FetchOptions
    ): Observable<OpticalFiberNetworkFindOneEntity> {
        const dto = opticalFiberNetworkFindOneFilterMapper(validContract);
        return this.api
            .execute(dto, options)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }
}
