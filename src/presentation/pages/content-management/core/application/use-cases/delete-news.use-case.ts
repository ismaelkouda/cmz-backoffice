import { inject, Injectable } from '@angular/core';
import { SimpleResponseDto } from '@shared/data/dtos/simple-response.dto';
import { Observable } from 'rxjs';
import { NewsRepository } from '../../domain/repositories/news.repository';

@Injectable({
    providedIn: 'root',
})
export class DeleteNewsUseCase {
    private readonly newsRepository = inject(NewsRepository);

    execute(id: string): Observable<SimpleResponseDto<void>> {
        return this.newsRepository.deleteNews(id);
    }
}
