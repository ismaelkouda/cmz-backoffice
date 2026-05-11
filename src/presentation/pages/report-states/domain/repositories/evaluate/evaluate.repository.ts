import { EvaluateFilterEntity } from '@pages/report-states/domain/entities/evaluate/evaluate-filter.entity';
import { EvaluateEntity } from '@pages/report-states/domain/entities/evaluate/evaluate.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

export abstract class EvaluateRepository {
    abstract execute(
        entity: EvaluateFilterEntity | null,
        page: string
    ): Observable<Paginate<EvaluateEntity>>;
}
