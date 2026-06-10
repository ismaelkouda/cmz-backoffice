import { Injectable, inject } from '@angular/core';
import { NewsQuery } from '@pages/content-management/application/queries/news/news.query';
import { NewsHandler } from '@pages/content-management/application/queries-handlers/news/news.handler';
import { NewsEntity } from '@pages/content-management/domain/entities/news/news.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({ providedIn: 'root' })
export class NewsBus {
    private readonly filterHandler = inject(NewsHandler);

    dispatch<T>(
        query: T,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<NewsEntity>> {
        if (query instanceof NewsQuery) {
            return this.filterHandler.execute(query, page);
        }

        throw new Error('No handler found for query');
    }
}
