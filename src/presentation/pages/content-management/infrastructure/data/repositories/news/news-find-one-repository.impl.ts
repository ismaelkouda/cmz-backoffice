import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { NewsFindOneFilterEntity } from '@presentation/pages/content-management/domain/entities/news/news-find-one-filter.entity';
import { NewsFindOneEntity } from '@presentation/pages/content-management/domain/entities/news/news-find-one.entity';
import { NewsFindOneRepository } from '@presentation/pages/content-management/domain/repositories/news/news-find-one-repository';
import { newsFindOneFilterMapper } from '@presentation/pages/content-management/infrastructure/data/mappers/news/news-find-one-filter.mapper';
import { NewsFindOneMapper } from '@presentation/pages/content-management/infrastructure/data/mappers/news/news-find-one.mapper';
import { NewsFindOneApi } from '@presentation/pages/content-management/infrastructure/data/sources/news/news-find-one.api';

@Injectable({ providedIn: 'root' })
export class NewsFindOneRepositoryImpl implements NewsFindOneRepository {
    private readonly api = inject(NewsFindOneApi);
    private readonly mapper = inject(NewsFindOneMapper);

    execute(filter: NewsFindOneFilterEntity): Observable<NewsFindOneEntity> {
        const paramsDto = newsFindOneFilterMapper(filter);
        return this.api
            .read(paramsDto)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }
}
