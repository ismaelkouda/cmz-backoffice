import { Injectable } from '@angular/core';
import { AllMapper } from '@presentation/pages/report-requests/data/mappers/all.mapper';
import { AllApi } from '@presentation/pages/report-requests/data/sources/all.api';
import { AllEntity } from '@presentation/pages/report-requests/domain/entities/all/all.entity';
import { AllRepository } from '@presentation/pages/report-requests/domain/repositories/all.repository';
import { AllFilter } from '@presentation/pages/report-requests/domain/value-objects/all-filter.vo';
import { Paginate } from '@shared/data/dtos/simple-response.dto';
import { Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AllRepositoryImpl extends AllRepository {
    constructor(
        private readonly api: AllApi,
        private readonly allMapper: AllMapper,
    ) {
        super();
    }

    fetchAll(filter: AllFilter | null, page: string): Observable<Paginate<AllEntity>> {
        return this.api.fetchAll(filter?.toDto() ?? {}, page).pipe(
            map((response) => this.allMapper.mapFromDto(response))
        );
    }
}
