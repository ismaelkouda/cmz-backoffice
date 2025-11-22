import { Paginate } from '@shared/interfaces/paginate';
import { Observable } from 'rxjs';
import { TreatmentEntity } from '../entities/treatment/treatment.entity';
import { TreatmentFilter } from '../value-objects/treatment-filter.vo';

export abstract class TreatmentRepository {
    abstract fetchTreatments(
        filter: TreatmentFilter,
        page: string
    ): Observable<Paginate<TreatmentEntity>>;
}
