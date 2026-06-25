import { ApproveFilterEntity } from '@pages/report-states/domain/entities/approve/approve-filter.entity';
import { ApproveEntity } from '@pages/report-states/domain/entities/approve/approve.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

export abstract class ApproveRepository {
    abstract execute(
        filter: ApproveFilterEntity | null,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<ApproveEntity>>;
}
