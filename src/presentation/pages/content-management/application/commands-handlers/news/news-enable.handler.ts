import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { NewsEnableCommand } from '@presentation/pages/content-management/application/commands/news/news-enable.command';
import { NewsUseCase } from '@presentation/pages/content-management/application/use-cases/news/news.use-case';

@Injectable({ providedIn: 'root' })
export class NewsEnableHandler {
    constructor(private readonly useCase: NewsUseCase) {}

    execute(command: NewsEnableCommand): Observable<SimpleResponseDto<void>> {
        return this.useCase.enable({
            uniqId: command.uniqId,
        });
    }
}
