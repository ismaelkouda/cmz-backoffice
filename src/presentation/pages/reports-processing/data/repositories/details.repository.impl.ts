import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { DetailsEntity } from '../../domain/entities/details/details.entity';
import { DetailsRepository } from '../../domain/repositories/details.repository';
import { DetailsMapper } from '../mappers/details.mapper';
import { DetailsApi } from '../sources/details.api';

@Injectable({
    providedIn: 'root',
})
export class DetailsRepositoryImpl extends DetailsRepository {
    constructor(
        private readonly detailsApi: DetailsApi,
        private readonly detailsMapper: DetailsMapper
    ) {
        super();
    }

    fetchDetails(id: string): Observable<DetailsEntity> {
        return this.detailsApi
            .fetchDetails(id)
            .pipe(map((response) => this.detailsMapper.mapFromDto(response)));
    }
}
