import { Injectable } from '@angular/core';
import { Paginate } from '@shared/interfaces/paginate';
import { Observable, map } from 'rxjs';
import { TreatmentEntity } from '../../domain/entities/treatment/treatment.entity';
import { TreatmentRepository } from '../../domain/repositories/treatment.repository';
import { TreatmentFilter } from '../../domain/value-objects/treatment-filter.vo';
import { TreatmentMapper } from '../mappers/treatment.mapper';
import { TreatmentApi } from '../sources/treatment.api';

@Injectable()
export class TreatmentRepositoryImpl extends TreatmentRepository {
    constructor(
        private readonly treatmentApi: TreatmentApi,
        private readonly treatmentMapper: TreatmentMapper
    ) {
        super();
    }

    fetchTreatments(
        filter: TreatmentFilter,
        page: string
    ): Observable<Paginate<TreatmentEntity>> {
        return this.treatmentApi
            .fetchTreatments(filter.toDto(), page)
            .pipe(map((response) => this.treatmentMapper.mapFromDto(response)));
    }
}
