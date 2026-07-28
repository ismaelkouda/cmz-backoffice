import { inject, Injectable } from '@angular/core';
import { MobileNetworkFindOneEntity } from '@pages/coverage-areas/domain/entities/mobile-network/mobile-network-find-one.entity';
import { MobileNetworkFindOneRepository } from '@pages/coverage-areas/domain/repositories/mobile-network/mobile-network-find-one.repository';
import { mobileNetworkFindOneFilterMapper } from '@pages/coverage-areas/infrastructure/data/mappers/mobile-network/mobile-network-find-one-filter.mapper';
import { MobileNetworkFindOneMapper } from '@pages/coverage-areas/infrastructure/data/mappers/mobile-network/mobile-network-find-one.mapper';
import { MobileNetworkFindOneApi } from '@pages/coverage-areas/infrastructure/data/sources/mobile-network/mobile-network-find-one.api';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { map, Observable } from 'rxjs';
import { MobileNetworkFindOneFilterValidateContract } from '@pages/coverage-areas/domain/contracts/mobile-network/mobile-network-find-one-filter.validate-contract';

@Injectable({ providedIn: 'root' })
export class MobileNetworkFindOneRepositoryImpl implements MobileNetworkFindOneRepository {
    private readonly api = inject(MobileNetworkFindOneApi);
    private readonly mapper = inject(MobileNetworkFindOneMapper);

    execute(
        validContract: MobileNetworkFindOneFilterValidateContract,
        options?: FetchOptions
    ): Observable<MobileNetworkFindOneEntity> {
        const dto = mobileNetworkFindOneFilterMapper(validContract);
        return this.api
            .execute(dto, options)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }
}
