import { Injectable, inject } from '@angular/core';
import { NewsCategoriesSelectEntity } from '@pages/content-management/domain/entities/news/news-categories-select.entity';
import { NewsCategoriesSelectRepository } from '@pages/content-management/domain/repositories/news/news-categories-select-repository';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class NewsCategoriesSelectUseCase {
    private readonly repository = inject(NewsCategoriesSelectRepository);

    execute(options?: FetchOptions): Observable<NewsCategoriesSelectEntity[]> {
        return this.repository.execute(options);
    }
}
