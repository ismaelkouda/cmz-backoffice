import { Injectable } from '@angular/core';
import { NewsFindOneQuery } from '@pages/content-management/application/queries/news/news-find-one.query';
import { NewsFindOneHandler } from '@pages/content-management/application/queries-handlers/news/news-find-one.handler';
import { NewsFindOneEntity } from '@pages/content-management/domain/entities/news/news-find-one.entity';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NewsFindOneBus {
    constructor(private readonly filterHandler: NewsFindOneHandler) {}

    dispatch<T>(query: T): Observable<NewsFindOneEntity> {
        if (query instanceof NewsFindOneQuery) {
            return this.filterHandler.execute(query);
        }

        throw new Error('No handler found for query');
    }
}
