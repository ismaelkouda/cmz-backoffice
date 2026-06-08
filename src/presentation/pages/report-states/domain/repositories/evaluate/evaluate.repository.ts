import { EvaluateFilterEntity } from '@pages/report-states/domain/entities/evaluate/evaluate-filter.entity';
import { EvaluateEntity } from '@pages/report-states/domain/entities/evaluate/evaluate.entity';
import { FetchOptions } from '@shared/application/types/fetch-options';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

export abstract class EvaluateRepository {
    abstract execute(
        entity: EvaluateFilterEntity | null,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<EvaluateEntity>>;
}
