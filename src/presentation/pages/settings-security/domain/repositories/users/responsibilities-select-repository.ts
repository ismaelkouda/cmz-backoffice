import { ResponsibilitiesSelectEntity } from '@pages/settings-security/domain/entities/users/responsibilities-select.entity';
import { Observable } from 'rxjs';

export abstract class ResponsibilitiesSelectRepository {
    abstract readAll(): Observable<ResponsibilitiesSelectEntity[]>;
}
