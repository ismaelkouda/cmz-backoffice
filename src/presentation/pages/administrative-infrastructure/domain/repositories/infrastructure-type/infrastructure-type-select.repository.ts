import { InfrastructureTypeSelectEntity } from '@presentation/pages/administrative-infrastructure/domain/entities/infrastructure-type/infrastructure-type-select.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

export abstract class InfrastructureTypeSelectRepository {
    abstract readAll(
        options?: FetchOptions
    ): Observable<InfrastructureTypeSelectEntity[]>;
}
