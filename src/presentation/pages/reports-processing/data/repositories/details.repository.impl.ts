import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { DetailsEntity } from '../../domain/entities/details/details.entity';
import { DetailsRepository } from '../../domain/repositories/details.repository';
import { DetailsFilter } from '../../domain/value-objects/details-filter.vo';
import { DetailsMapper } from '../mappers/details.mapper';
import { DetailsApi } from '../sources/details.api';

@Injectable({
    providedIn: 'root',
})
export class DetailsRepositoryImpl extends DetailsRepository {
    private readonly detailsApi = inject(DetailsApi);
    private readonly detailsMapper = inject(DetailsMapper);

    fetchDetails(
        filter: DetailsFilter,
        endPointType?: EndPointType
    ): Observable<DetailsEntity> {
        return this.detailsApi
            .fetchDetails(filter, endPointType)
            .pipe(map((response) => this.detailsMapper.mapFromDto(response)));
    }
}
