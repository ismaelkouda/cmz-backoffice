import { Injectable, inject } from '@angular/core';
import { NewsCategoriesSelectEntity } from '@pages/content-management/domain/entities/news/news-categories-select.entity';
import { NewsCategoriesSelectRepository } from '@pages/content-management/domain/repositories/news/news-categories-select-repository';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class NewsCategoriesSelectUseCase {
    private readonly repository = inject(NewsCategoriesSelectRepository);

    execute(): Observable<NewsCategoriesSelectEntity[]> {
        return this.repository.execute();
    }
}
