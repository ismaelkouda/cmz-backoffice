import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CategoryEntity } from '../../domain/entities/category.entity';
import { NewsRepository } from '../../domain/repositories/news.repository';

@Injectable({
    providedIn: 'root',
})
export class GetCategoryUseCase {
    private readonly newsRepository = inject(NewsRepository);

    execute(): Observable<CategoryEntity[]> {
        return this.newsRepository.getCategory();
    }
}
