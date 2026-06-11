import { NewsCategoriesSelectEntity } from '@pages/content-management/domain/entities/news/news-categories-select.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

export abstract class NewsCategoriesSelectRepository {
    abstract execute(
        options?: FetchOptions
    ): Observable<NewsCategoriesSelectEntity[]>;
}
