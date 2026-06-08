import { RejectFilterEntity } from '@pages/report-states/domain/entities/reject/reject-filter.entity';
import { RejectEntity } from '@pages/report-states/domain/entities/reject/reject.entity';
import { FetchOptions } from '@shared/application/types/fetch-options';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

export abstract class RejectRepository {
    abstract execute(
        entity: RejectFilterEntity | null,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<RejectEntity>>;
}
