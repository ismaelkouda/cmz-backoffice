import { InfrastructureFindOneFilterEntity } from '@presentation/pages/administrative-infrastructure/domain/entities/infrastructure/infrastructure-find-one-filter.entity';
import { InfrastructureFindOneEntity } from '@presentation/pages/administrative-infrastructure/domain/entities/infrastructure/infrastructure-find-one.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

export abstract class InfrastructureFindOneRepository {
    abstract execute(
        filter: InfrastructureFindOneFilterEntity,
        options?: FetchOptions
    ): Observable<InfrastructureFindOneEntity>;
}
