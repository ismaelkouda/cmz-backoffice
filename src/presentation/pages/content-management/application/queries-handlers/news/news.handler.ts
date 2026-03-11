import { Injectable } from '@angular/core';
import { NewsQuery } from '@pages/content-management/application/queries/news/news.query';
import { NewsUseCase } from '@pages/content-management/application/use-cases/news/news.use-case';
import { NewsEntity } from '@pages/content-management/domain/entities/news/news.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

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
