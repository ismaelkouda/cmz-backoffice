import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { NewsCategoriesSelectEntity } from '@presentation/pages/content-management/domain/entities/news/news-categories-select.entity';
import { NewsCategoriesSelectRepository } from '@presentation/pages/content-management/domain/repositories/news/news-categories-select-repository';

@Injectable({
    providedIn: 'root',
})
export class NewsCategoriesSelectUseCase {
    private readonly repository = inject(NewsCategoriesSelectRepository);

    execute(): Observable<NewsCategoriesSelectEntity[]> {
        return this.repository.execute();
    }
}
