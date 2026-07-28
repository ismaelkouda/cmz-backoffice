import { OpticalFiberNetworkFindOneFilterValidateContract } from '@pages/coverage-areas/domain/contracts/optical-fiber-network/optical-fiber-network-find-one-filter.validate-contract';
import { OpticalFiberNetworkFindOneEntity } from '@pages/coverage-areas/domain/entities/optical-fiber-network/optical-fiber-network-find-one.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

export abstract class OpticalFiberNetworkFindOneRepository {
    abstract execute(
        filter: OpticalFiberNetworkFindOneFilterValidateContract,
        options?: FetchOptions
    ): Observable<OpticalFiberNetworkFindOneEntity>;
}
