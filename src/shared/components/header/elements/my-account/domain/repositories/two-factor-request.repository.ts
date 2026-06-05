import { Observable } from 'rxjs';
import { TwoFactorRequestEntity } from '../entities/two-factor-request.entity';
import { TwoFactorRequestResultEntity } from '../entities/two-factor-request-result.entity';

export abstract class TwoFactorRequestRepository {
    abstract execute(
        entity: TwoFactorRequestEntity
    ): Observable<TwoFactorRequestResultEntity>;
}
