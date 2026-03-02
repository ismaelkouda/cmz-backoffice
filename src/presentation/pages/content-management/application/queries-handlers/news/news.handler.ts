import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Paginate } from '@shared/data/dto/simple-response.dto';

import { NewsQuery } from '@presentation/pages/content-management/application/queries/news/news.query';
import { NewsUseCase } from '@presentation/pages/content-management/application/use-cases/news/news.use-case';
import { NewsEntity } from '@presentation/pages/content-management/domain/entities/news/news.entity';

@Injectable({ providedIn: 'root' })
export class NewsHandler {
    constructor(private readonly useCase: NewsUseCase) {}

    execute(
        command: NewsQuery,
        page: string
    ): Observable<Paginate<NewsEntity>> {
        return this.useCase.execute(
            {
                search: command.search,
                status: command.status,
                startDate: command.startDate,
                endDate: command.endDate,
            },
            page
        );
    }
}
