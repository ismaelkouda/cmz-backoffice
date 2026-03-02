import { Observable } from 'rxjs';

import { NewsCategoriesSelectEntity } from '@presentation/pages/content-management/domain/entities/news/news-categories-select.entity';

export abstract class NewsCategoriesSelectRepository {
    abstract execute(): Observable<NewsCategoriesSelectEntity[]>;
}
