import { WaitingEntity } from '@presentation/pages/report-requests/domain/entities/waiting/waiting.entity';
import { WaitingFilter } from '@presentation/pages/report-requests/domain/value-objects/waiting-filter.vo';
import { Paginate } from '@shared/interfaces/paginate';
import { Observable } from 'rxjs';

export abstract class WaitingRepository {
    abstract fetchWaiting(
        filter: WaitingFilter,
        page: string
    ): Observable<Paginate<WaitingEntity>>;
}
