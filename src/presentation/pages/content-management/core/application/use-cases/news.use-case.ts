import { inject, Injectable } from '@angular/core';
import { Paginate } from '@shared/data/dtos/simple-response.dto';
import { Observable } from 'rxjs';
import { NewsEntity } from '../../domain/entities/news.entity';
import { NewsRepository } from '../../domain/repositories/news.repository';
import { NewsFilter } from '../../domain/value-objects/news-filter.vo';

@Injectable({
    providedIn: 'root',
})
export class FetchNewsUseCase {
    private readonly newsRepository = inject(NewsRepository);

    execute(filter: NewsFilter, page: string): Observable<Paginate<NewsEntity>> {
        return this.newsRepository.fetchNews(filter, page);
    }
}
