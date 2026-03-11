import { inject, Injectable } from '@angular/core';
import { AllFilterEntity } from '@pages/processing/domain/entities/all/all-filter.entity';
import { AllEntity } from '@pages/processing/domain/entities/all/all.entity';
import { AllRepository } from '@pages/processing/domain/repositories/all/all.repository';
import { allFilterMapper } from '@pages/processing/infrastructure/data/mappers/all/all-filter.mapper';
import { AllMapper } from '@pages/processing/infrastructure/data/mappers/all/all.mapper';
import { AllApi } from '@pages/processing/infrastructure/data/sources/all/all.api';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable, map } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AllRepositoryImpl extends AllRepository {
    private readonly api = inject(AllApi);
    private readonly mapper = inject(AllMapper);

    execute(
        entity: AllFilterEntity,
        page: string
    ): Observable<Paginate<AllEntity>> {
        return this.api
            .execute(allFilterMapper(entity), page)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }
}
