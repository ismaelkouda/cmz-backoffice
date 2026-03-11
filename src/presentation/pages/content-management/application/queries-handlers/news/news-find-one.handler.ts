import { Injectable } from '@angular/core';
import { NewsFindOneQuery } from '@pages/content-management/application/queries/news/news-find-one.query';
import { NewsFindOneUseCase } from '@pages/content-management/application/use-cases/news/news-find-one.use-case';
import { NewsFindOneEntity } from '@pages/content-management/domain/entities/news/news-find-one.entity';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NewsFindOneHandler {
    constructor(private readonly useCase: NewsFindOneUseCase) {}

    execute(command: NewsFindOneQuery): Observable<NewsFindOneEntity> {
        return this.useCase.execute({
            uniqId: command.uniqId,
        });
    }
}
