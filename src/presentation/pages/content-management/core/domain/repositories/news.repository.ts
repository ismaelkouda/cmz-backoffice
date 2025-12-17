import { Paginate, SimpleResponseDto } from '@shared/data/dtos/simple-response.dto';
import { Observable } from 'rxjs';
import { CategoryEntity } from '../entities/category.entity';
import { GetNewsByIdEntity } from '../entities/get-news-by-id.entity';
import { NewsEntity } from '../entities/news.entity';
import { NewsFilter } from '../value-objects/news-filter.vo';

export abstract class NewsRepository {
    abstract fetchNews(filter: NewsFilter, page: string): Observable<Paginate<NewsEntity>>;
    abstract getNewsById(id: string): Observable<GetNewsByIdEntity>;
    abstract getCategory(): Observable<CategoryEntity[]>;
    abstract createNews(payload: FormData): Observable<NewsEntity>;
    abstract updateNews(id: string, payload: FormData): Observable<NewsEntity>;
    abstract deleteNews(id: string): Observable<SimpleResponseDto<void>>;
    abstract enableNews(id: string): Observable<SimpleResponseDto<void>>;
    abstract disableNews(id: string): Observable<SimpleResponseDto<void>>;
}
