import { inject, Injectable } from '@angular/core';
import { OpticalFiberNetworkFindOneFilterContract } from '@pages/coverage-areas/domain/contracts/optical-fiber-network/optical-fiber-network-find-one-filter.contract';
import { OpticalFiberNetworkFindOneEntity } from '@pages/coverage-areas/domain/entities/optical-fiber-network/optical-fiber-network-find-one.entity';
import { OpticalFiberNetworkFindOneRepository } from '@pages/coverage-areas/domain/repositories/optical-fiber-network/optical-fiber-network-find-one.repository';
import { opticalFiberNetworkFindOneFilterVo } from '@pages/coverage-areas/domain/value-objects/optical-fiber-network/optical-fiber-network-find-one-filter.vo';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { defer, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class OpticalFiberNetworkFindOneUseCase {
    private readonly repository = inject(OpticalFiberNetworkFindOneRepository);

    execute(
        contract: OpticalFiberNetworkFindOneFilterContract,
        options?: FetchOptions
    ): Observable<OpticalFiberNetworkFindOneEntity> {
        return defer(() =>
            this.repository.execute(
                opticalFiberNetworkFindOneFilterVo(contract),
                options
            )
        );
    }
}
