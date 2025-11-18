import { inject, Injectable } from '@angular/core';
import { Paginate } from '@shared/interfaces/paginate';
import { Observable } from 'rxjs';
import { TreatmentEntity } from '../entities/treatment/treatment.entity';
import { TreatmentRepository } from '../repositories/treatment.repository';
import { TreatmentFilter } from '../value-objects/treatment-filter.vo';

@Injectable({
    providedIn: 'root',
})
export class FetchTreatmentsUseCase {
    private readonly treatmentRepository = inject(TreatmentRepository);

    execute(
        filter: TreatmentFilter,
        page: string
    ): Observable<Paginate<TreatmentEntity>> {
        return this.treatmentRepository.fetchTreatments(filter, page);
    }
}
