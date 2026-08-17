import { ResponsibilitiesSelectEntity } from '@pages/settings-security/domain/entities/users/responsibilities-select.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

export abstract class ResponsibilitiesSelectRepository {
    abstract readAll(
        options?: FetchOptions
    ): Observable<ResponsibilitiesSelectEntity[]>;
}
