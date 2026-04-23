import { inject, Injectable } from '@angular/core';
import { AllFilterEntity } from '@pages/requests/domain/entities/all/all-filter.entity';
import { AllEntity } from '@pages/requests/domain/entities/all/all.entity';
import { AllRepository } from '@pages/requests/domain/repositories/all/all.repository';
import { AllFilterMapper } from '@pages/requests/infrastructure/data/mappers/all/all-filter.mapper';
import { AllMapper } from '@pages/requests/infrastructure/data/mappers/all/all.mapper';
import { AllApi } from '@pages/requests/infrastructure/data/sources/all/all.api';
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
        page: string
    ): Observable<Paginate<AllEntity>> {
        const paramsDto = this.filterMapper.map(entity);
        return this.api
            .execute(paramsDto, page)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }
}
