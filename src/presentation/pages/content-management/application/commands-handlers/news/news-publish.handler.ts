import { Injectable } from '@angular/core';
import { NewsUseCase } from '@pages/content-management/application/use-cases/news/news.use-case';
import { NewsPublishCommand } from '@pages/content-management/application/commands/news/news-publish.command';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NewsPublishHandler {
    constructor(private readonly useCase: NewsUseCase) {}

    execute(command: NewsPublishCommand): Observable<SimpleResponseDto<void>> {
        return this.useCase.publish({
            uniqId: command.uniqId,
        });
    }
}
