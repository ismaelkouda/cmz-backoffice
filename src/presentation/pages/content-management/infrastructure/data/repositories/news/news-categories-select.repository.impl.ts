import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { NewsCategoriesSelectEntity } from '@presentation/pages/content-management/domain/entities/news/news-categories-select.entity';
import { NewsCategoriesSelectRepository } from '@presentation/pages/content-management/domain/repositories/news/news-categories-select-repository';
import { NewsCategoriesSelectMapper } from '@presentation/pages/content-management/infrastructure/data/mappers/news/news-categories-select.mapper';
import { NewsCategoriesSelectApi } from '@presentation/pages/content-management/infrastructure/data/sources/news/news-categories-select.api';

@Injectable({ providedIn: 'root' })
export class NewsCategoriesSelectRepositoryImpl implements NewsCategoriesSelectRepository {
    private readonly api = inject(NewsCategoriesSelectApi);
    private readonly mapper = inject(NewsCategoriesSelectMapper);

    execute(): Observable<NewsCategoriesSelectEntity[]> {
        return this.api
            .readAll()
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }
}
