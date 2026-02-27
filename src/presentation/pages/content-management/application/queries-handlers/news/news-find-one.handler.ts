import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { NewsFindOneQuery } from '@presentation/pages/content-management/application/queries/news/news-find-one.query';
import { NewsFindOneUseCase } from '@presentation/pages/content-management/application/use-cases/news/news-find-one.use-case';
import { NewsFindOneEntity } from '@presentation/pages/content-management/domain/entities/news/news-find-one.entity';

@Injectable({ providedIn: 'root' })
export class NewsFindOneHandler {
    constructor(private readonly useCase: NewsFindOneUseCase) {}

    execute(command: NewsFindOneQuery): Observable<NewsFindOneEntity> {
        return this.useCase.execute({
            uniqId: command.uniqId,
        });
    }
}
