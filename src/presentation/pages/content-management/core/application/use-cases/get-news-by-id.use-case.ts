
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NewsEntity } from '../../domain/entities/news.entity';
import { NewsRepository } from '../../domain/repositories/news.repository';

@Injectable({
    providedIn: 'root',
})
export class GetNewsByIdUseCase {
    private readonly newsRepository = inject(NewsRepository);

    execute(id: string): Observable<NewsEntity> {
        return this.newsRepository.getNewsById(id);
    }
}
