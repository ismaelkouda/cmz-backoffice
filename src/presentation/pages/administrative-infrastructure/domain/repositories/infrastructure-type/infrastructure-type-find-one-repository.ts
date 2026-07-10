import { InfrastructureTypeFindOneFilterEntity } from '@presentation/pages/administrative-infrastructure/domain/entities/infrastructure-type/infrastructure-type-find-one-filter.entity';
import { InfrastructureTypeFindOneEntity } from '@presentation/pages/administrative-infrastructure/domain/entities/infrastructure-type/infrastructure-type-find-one.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

export abstract class InfrastructureTypeFindOneRepository {
    abstract execute(
        filter: InfrastructureTypeFindOneFilterEntity,
        options?: FetchOptions
    ): Observable<InfrastructureTypeFindOneEntity>;
}
