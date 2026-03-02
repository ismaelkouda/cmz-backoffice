import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { NewsFindOneFilterEntity } from '@presentation/pages/content-management/domain/entities/news/news-find-one-filter.entity';
import { NewsFindOneEntity } from '@presentation/pages/content-management/domain/entities/news/news-find-one.entity';

@Injectable({
    providedIn: 'root',
})
export abstract class NewsFindOneRepository {
    abstract execute(
        filter: NewsFindOneFilterEntity
    ): Observable<NewsFindOneEntity>;
}
