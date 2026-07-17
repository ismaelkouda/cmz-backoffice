import { InfrastructureTypeFindOneEntity } from '@presentation/pages/administrative-infrastructure/domain/entities/infrastructure-type/infrastructure-type-find-one.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';
import { InfrastructureTypeFindOneFilterValidateContract } from '@presentation/pages/administrative-infrastructure/domain/contracts/infrastructure-type/infrastructure-type-find-one-filter.validate-contract';

export abstract class InfrastructureTypeFindOneRepository {
    abstract execute(
        filter: InfrastructureTypeFindOneFilterValidateContract,
        options?: FetchOptions
    ): Observable<InfrastructureTypeFindOneEntity>;
}
