import { NewsCategoriesSelectEntity } from '@pages/content-management/domain/entities/news/news-categories-select.entity';
import { Observable } from 'rxjs';

export abstract class NewsCategoriesSelectRepository {
    abstract execute(): Observable<NewsCategoriesSelectEntity[]>;
}
