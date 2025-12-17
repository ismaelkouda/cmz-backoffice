
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GetNewsByIdEntity } from '../../domain/entities/get-news-by-id.entity';
import { NewsRepository } from '../../domain/repositories/news.repository';

@Injectable({
    providedIn: 'root',
})
export class GetNewsByIdUseCase {
    private readonly newsRepository = inject(NewsRepository);

    execute(id: string): Observable<GetNewsByIdEntity> {
        return this.newsRepository.getNewsById(id);
    }
}
