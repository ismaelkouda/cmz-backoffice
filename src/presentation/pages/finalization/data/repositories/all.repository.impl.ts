import { Injectable } from '@angular/core';
import { Paginate } from '@shared/data/dtos/simple-response.dto';
import { Observable, map } from 'rxjs';
import { AllEntity } from '../../domain/entities/all/all.entity';
import { AllRepository } from '../../domain/repositories/all.repository';
import { AllFilter } from '../../domain/value-objects/all-filter.vo';
import { AllMapper } from '../mappers/all.mapper';
import { AllApi } from '../sources/all.api';

@Injectable({
    providedIn: 'root',
})
export class AllRepositoryImpl extends AllRepository {
    constructor(
        private readonly allApi: AllApi,
        private readonly allMapper: AllMapper
    ) {
        super();
    }

    fetchAll(filter: AllFilter | null, page: string): Observable<Paginate<AllEntity>> {
        return this.allApi
            .fetchAll(filter?.toDto() ?? {}, page)
            .pipe(map((response) => this.allMapper.mapFromDto(response)));
    }
}
