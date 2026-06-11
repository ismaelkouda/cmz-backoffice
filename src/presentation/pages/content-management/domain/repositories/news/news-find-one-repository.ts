import { Injectable } from '@angular/core';
import { NewsFindOneFilterEntity } from '@pages/content-management/domain/entities/news/news-find-one-filter.entity';
import { NewsFindOneEntity } from '@pages/content-management/domain/entities/news/news-find-one.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export abstract class NewsFindOneRepository {
    abstract execute(
        filter: NewsFindOneFilterEntity,
        options?: FetchOptions
    ): Observable<NewsFindOneEntity>;
}
