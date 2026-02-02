import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { EndPointType } from '@shared/domain/types/end-point.types';

import { DetailsEntity } from '../entities/details/details.entity';
import { DetailsRepository } from '../repositories/details.repository';
import { DetailsFilter } from '../value-objects/details-filter.vo';

@Injectable({
    providedIn: 'root',
})
export class FetchDetailsUseCase {
    private readonly detailsRepository = inject(DetailsRepository);

    execute(
        filter: DetailsFilter,
        endPointType?: EndPointType
    ): Observable<DetailsEntity> {
        return this.detailsRepository.fetchDetails(filter, endPointType);
    }
}
