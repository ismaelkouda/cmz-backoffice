import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Paginate } from '@shared/data/dto/simple-response.dto';

import { NewsQuery } from '@presentation/pages/content-management/application/queries/news/news.query';
import { NewsHandler } from '@presentation/pages/content-management/application/queries-handlers/news/news.handler';
import { NewsEntity } from '@presentation/pages/content-management/domain/entities/news/news.entity';

@Injectable({ providedIn: 'root' })
export class NewsBus {
    constructor(private readonly filterHandler: NewsHandler) {}

    dispatch<T>(query: T, page: string): Observable<Paginate<NewsEntity>> {
        if (query instanceof NewsQuery) {
            return this.filterHandler.execute(query, page);
        }

        throw new Error('No handler found for query');
    }
}
