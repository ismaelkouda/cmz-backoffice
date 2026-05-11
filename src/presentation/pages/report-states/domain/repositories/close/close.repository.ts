import { CloseFilterEntity } from '@pages/report-states/domain/entities/close/close-filter.entity';
import { CloseEntity } from '@pages/report-states/domain/entities/close/close.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

export abstract class CloseRepository {
    abstract execute(
        filter: CloseFilterEntity | null,
        page: string
    ): Observable<Paginate<CloseEntity>>;
}
