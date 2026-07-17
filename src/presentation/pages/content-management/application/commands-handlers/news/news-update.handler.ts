import { newsUpdateCommandMapper } from '@pages/content-management/application/commands-mappers/news/news-update.mapper';
import { Injectable, inject } from '@angular/core';
import { NewsUpdateCommand } from '@pages/content-management/application/commands/news/news-update.command';
import { NewsUseCase } from '@pages/content-management/application/use-cases/news/news.use-case';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NewsUpdateHandler {
    private readonly useCase = inject(NewsUseCase);

    execute(command: NewsUpdateCommand): Observable<SimpleResponseDto<void>> {
        return this.useCase.update(newsUpdateCommandMapper(command));
    }
}
