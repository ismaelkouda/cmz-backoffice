import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { HomeFindOneFilterEntity } from '@presentation/pages/content-management/domain/entities/home/home-find-one-filter.entity';
import { HomeFindOneEntity } from '@presentation/pages/content-management/domain/entities/home/home-find-one.entity';
import { HomeFindOneRepository } from '@presentation/pages/content-management/domain/repositories/home/home-find-one-repository';
import { homeFindOneFilterMapper } from '@presentation/pages/content-management/infrastructure/data/mappers/home/home-find-one-filter.mapper';
import { HomeFindOneMapper } from '@presentation/pages/content-management/infrastructure/data/mappers/home/home-find-one.mapper';
import { HomeFindOneApi } from '@presentation/pages/content-management/infrastructure/data/sources/home/home-find-one.api';

@Injectable({ providedIn: 'root' })
export class HomeFindOneRepositoryImpl implements HomeFindOneRepository {
    private readonly api = inject(HomeFindOneApi);
    private readonly mapper = inject(HomeFindOneMapper);

    execute(filter: HomeFindOneFilterEntity): Observable<HomeFindOneEntity> {
        const paramsDto = homeFindOneFilterMapper(filter);
        return this.api
            .read(paramsDto)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }
}
