import { inject } from '@angular/core';
import { MobileNetworkFindOneFilterContract } from '@pages/coverage-areas/domain/contracts/mobile-network/mobile-network-find-one-filter.contract';
import { MobileNetworkFindOneEntity } from '@pages/coverage-areas/domain/entities/mobile-network/mobile-network-find-one.entity';
import { MobileNetworkFindOneRepository } from '@pages/coverage-areas/domain/repositories/mobile-network/mobile-network-find-one.repository';
import { mobileNetworkFindOneFilterVo } from '@pages/coverage-areas/domain/value-objects/mobile-network/mobile-network-find-one-filter.vo';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { defer, Observable } from 'rxjs';

export class MobileNetworkFindOneUseCase {
    private readonly repository = inject(MobileNetworkFindOneRepository);

    execute(
        contract: MobileNetworkFindOneFilterContract,
        options?: FetchOptions
    ): Observable<MobileNetworkFindOneEntity> {
        return defer(() =>
            this.repository.execute(
                mobileNetworkFindOneFilterVo(contract),
                options
            )
        );
    }
}
