import { Injectable, inject } from '@angular/core';
import { NewsFindOneQuery } from '@pages/content-management/application/queries/news/news-find-one.query';
import { NewsFindOneHandler } from '@pages/content-management/application/queries-handlers/news/news-find-one.handler';
import { NewsFindOneEntity } from '@pages/content-management/domain/entities/news/news-find-one.entity';
import { Observable } from 'rxjs';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({ providedIn: 'root' })
export class NewsFindOneBus {
    private readonly filterHandler = inject(NewsFindOneHandler);

    dispatch<T>(
        query: T,
        options?: FetchOptions
    ): Observable<NewsFindOneEntity> {
        if (query instanceof NewsFindOneQuery) {
            return this.filterHandler.execute(query, options);
        }

        throw new Error('No handler found for query');
    }
}
