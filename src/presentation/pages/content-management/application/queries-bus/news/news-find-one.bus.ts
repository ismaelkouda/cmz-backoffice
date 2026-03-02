import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { NewsFindOneQuery } from '@presentation/pages/content-management/application/queries/news/news-find-one.query';
import { NewsFindOneHandler } from '@presentation/pages/content-management/application/queries-handlers/news/news-find-one.handler';
import { NewsFindOneEntity } from '@presentation/pages/content-management/domain/entities/news/news-find-one.entity';

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
