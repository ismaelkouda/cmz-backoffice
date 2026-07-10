import { ResponsibilitiesSelectEntity } from '@presentation/pages/administrative-infrastructure/domain/entities/infrastructure-type/responsibilities-select.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

export abstract class ResponsibilitiesSelectRepository {
    abstract readAll(
        options?: FetchOptions
    ): Observable<ResponsibilitiesSelectEntity[]>;
}
