import { inject, Injectable } from '@angular/core';
import { HomeFindOneFilterEntity } from '@pages/content-management/domain/entities/home/home-find-one-filter.entity';
import { HomeFindOneEntity } from '@pages/content-management/domain/entities/home/home-find-one.entity';
import { HomeFindOneRepository } from '@pages/content-management/domain/repositories/home/home-find-one-repository';
import { homeFindOneFilterMapper } from '@pages/content-management/infrastructure/data/mappers/home/home-find-one-filter.mapper';
import { HomeFindOneMapper } from '@pages/content-management/infrastructure/data/mappers/home/home-find-one.mapper';
import { HomeFindOneApi } from '@pages/content-management/infrastructure/data/sources/home/home-find-one.api';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HomeFindOneRepositoryImpl implements HomeFindOneRepository {
    private readonly api = inject(HomeFindOneApi);
    private readonly mapper = inject(HomeFindOneMapper);

    execute(
        filter: HomeFindOneFilterEntity,
        options?: FetchOptions
    ): Observable<HomeFindOneEntity> {
        const paramsDto = homeFindOneFilterMapper(filter);
        return this.api
            .read(paramsDto, options)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }
}
