import { Observable } from 'rxjs';

import { ResponsibilitiesSelectEntity } from '@presentation/pages/settings-security/domain/entities/users/responsibilities-select.entity';

export abstract class ResponsibilitiesSelectRepository {
    abstract readAll(): Observable<ResponsibilitiesSelectEntity[]>;
}
