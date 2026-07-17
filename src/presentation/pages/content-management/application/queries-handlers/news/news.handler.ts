import { newsQueryMapper } from '@pages/content-management/application/queries-mappers/news/news.mapper';
import { Injectable, inject } from '@angular/core';
import { NewsQuery } from '@pages/content-management/application/queries/news/news.query';
import { NewsUseCase } from '@pages/content-management/application/use-cases/news/news.use-case';
import { NewsEntity } from '@pages/content-management/domain/entities/news/news.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NewsHandler {
    private readonly useCase = inject(NewsUseCase);

    execute(
        command: NewsQuery,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<NewsEntity>> {
        return this.useCase.execute(newsQueryMapper(command), page, options);
    }
}
