import { newsPublishCommandMapper } from '@pages/content-management/application/commands-mappers/news/news-publish.mapper';
import { Injectable, inject } from '@angular/core';
import { NewsPublishCommand } from '@pages/content-management/application/commands/news/news-publish.command';
import { NewsUseCase } from '@pages/content-management/application/use-cases/news/news.use-case';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NewsPublishHandler {
    private readonly useCase = inject(NewsUseCase);

    execute(command: NewsPublishCommand): Observable<SimpleResponseDto<void>> {
        return this.useCase.publish(newsPublishCommandMapper(command));
    }
}
