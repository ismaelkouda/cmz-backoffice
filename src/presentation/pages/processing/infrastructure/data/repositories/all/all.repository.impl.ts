import { inject, Injectable } from '@angular/core';
import { AllFilterEntity } from '@pages/processing/domain/entities/all/all-filter.entity';
import { AllEntity } from '@pages/processing/domain/entities/all/all.entity';
import { AllRepository } from '@pages/processing/domain/repositories/all/all.repository';
import { AllFilterMapper } from '@pages/processing/infrastructure/data/mappers/all/all-filter.mapper';
import { AllMapper } from '@pages/processing/infrastructure/data/mappers/all/all.mapper';
import { AllApi } from '@pages/processing/infrastructure/data/sources/all/all.api';
import { FetchOptions } from '@shared/application/types/fetch-options';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable, map } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AllRepositoryImpl extends AllRepository {
    private readonly api = inject(AllApi);
    private readonly mapper = inject(AllMapper);
    private readonly filterMapper = inject(AllFilterMapper);

    execute(
        entity: AllFilterEntity,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<AllEntity>> {
        return this.api
            .execute(this.filterMapper.map(entity), page, options)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }
}
