import { RejectFilterEntity } from '@pages/report-states/domain/entities/reject/reject-filter.entity';
import { RejectEntity } from '@pages/report-states/domain/entities/reject/reject.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

export abstract class RejectRepository {
    abstract execute(
        entity: RejectFilterEntity | null,
        page: string
    ): Observable<Paginate<RejectEntity>>;
}
