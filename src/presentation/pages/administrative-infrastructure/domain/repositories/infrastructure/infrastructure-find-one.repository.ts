import { InfrastructureFindOneEntity } from '@presentation/pages/administrative-infrastructure/domain/entities/infrastructure/infrastructure-find-one.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';
import { InfrastructureFindOneFilterValidateContract } from '@presentation/pages/administrative-infrastructure/domain/contracts/infrastructure/infrastructure-find-one-filter.validate-contract';

export abstract class InfrastructureFindOneRepository {
    abstract execute(
        filter: InfrastructureFindOneFilterValidateContract,
        options?: FetchOptions
    ): Observable<InfrastructureFindOneEntity>;
}
