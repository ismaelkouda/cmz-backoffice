import { InfrastructureSelectEntity } from '@presentation/pages/administrative-infrastructure/domain/entities/infrastructure/infrastructure-select.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

export abstract class InfrastructureSelectRepository {
    abstract readAll(
        options?: FetchOptions
    ): Observable<InfrastructureSelectEntity[]>;
}
