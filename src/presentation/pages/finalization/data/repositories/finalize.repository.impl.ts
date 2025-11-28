import { Injectable } from '@angular/core';
import { Paginate } from '@shared/data/dtos/simple-response.dto';
import { Observable, map } from 'rxjs';
import { FinalizeEntity } from '../../domain/entities/finalize/finalize.entity';
import { FinalizeRepository } from '../../domain/repositories/finalize.repository';
import { FinalizeFilter } from '../../domain/value-objects/finalize-filter.vo';
import { FinalizeMapper } from '../mappers/finalize.mapper';
import { FinalizeApi } from '../sources/finalize.api';

@Injectable({
    providedIn: 'root',
})
export class FinalizeRepositoryImpl extends FinalizeRepository {
    constructor(
        private readonly finalizeApi: FinalizeApi,
        private readonly finalizeMapper: FinalizeMapper
    ) {
        super();
    }

    fetchFinalizes(
        filter: FinalizeFilter,
        page: string
    ): Observable<Paginate<FinalizeEntity>> {
        return this.finalizeApi
            .fetchFinalizes(filter.toDto(), page)
            .pipe(map((response) => this.finalizeMapper.mapFromDto(response)));
    }
}
