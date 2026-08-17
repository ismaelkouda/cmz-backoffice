import { MobileNetworkFindOneFilterValidateContract } from '@pages/coverage-areas/domain/contracts/mobile-network/mobile-network-find-one-filter.validate-contract';
import { MobileNetworkFindOneEntity } from '@pages/coverage-areas/domain/entities/mobile-network/mobile-network-find-one.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

export abstract class MobileNetworkFindOneRepository {
    abstract execute(
        filter: MobileNetworkFindOneFilterValidateContract,
        options?: FetchOptions
    ): Observable<MobileNetworkFindOneEntity>;
}
