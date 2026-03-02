import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { NewsDeleteCommand } from '@presentation/pages/content-management/application/commands/news/news-delete.command';
import { NewsUseCase } from '@presentation/pages/content-management/application/use-cases/news/news.use-case';

@Injectable({ providedIn: 'root' })
export class NewsDeleteHandler {
    constructor(private readonly useCase: NewsUseCase) {}

    execute(command: NewsDeleteCommand): Observable<SimpleResponseDto<void>> {
        return this.useCase.delete({
            uniqId: command.uniqId,
        });
    }
}
