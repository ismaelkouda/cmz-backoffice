import { Paginate } from '@shared/data/dtos/simple-response.dto';
import { Observable } from 'rxjs';
import { TreatmentEntity } from '../entities/treatment/treatment.entity';
import { TreatmentFilter } from '../value-objects/treatment-filter.vo';

export abstract class TreatmentRepository {
    abstract fetchTreatments(
        filter: TreatmentFilter | null,
        page: string
    ): Observable<Paginate<TreatmentEntity>>;
}
