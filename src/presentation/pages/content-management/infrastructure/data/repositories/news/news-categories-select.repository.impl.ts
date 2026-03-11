import { Injectable, inject } from '@angular/core';
import { NewsCategoriesSelectEntity } from '@pages/content-management/domain/entities/news/news-categories-select.entity';
import { NewsCategoriesSelectRepository } from '@pages/content-management/domain/repositories/news/news-categories-select-repository';
import { NewsCategoriesSelectMapper } from '@pages/content-management/infrastructure/data/mappers/news/news-categories-select.mapper';
import { NewsCategoriesSelectApi } from '@pages/content-management/infrastructure/data/sources/news/news-categories-select.api';
import { Observable, map } from 'rxjs';

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
