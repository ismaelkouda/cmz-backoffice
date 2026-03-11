import { Injectable } from '@angular/core';
import { NewsDisableCommand } from '@pages/content-management/application/commands/news/news-disable.command';
import { NewsUseCase } from '@pages/content-management/application/use-cases/news/news.use-case';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NewsDisableHandler {
    constructor(private readonly useCase: NewsUseCase) {}

    execute(command: NewsDisableCommand): Observable<SimpleResponseDto<void>> {
        return this.useCase.disable({
            uniqId: command.uniqId,
        });
    }
}
