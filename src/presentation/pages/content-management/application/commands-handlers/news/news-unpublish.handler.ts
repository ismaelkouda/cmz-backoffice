import { Injectable } from '@angular/core';
import { NewsUseCase } from '@pages/content-management/application/use-cases/news/news.use-case';
import { NewsUnpublishCommand } from '@pages/content-management/application/commands/news/news-unpublish.command';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NewsUnpublishHandler {
    constructor(private readonly useCase: NewsUseCase) {}

    execute(
        command: NewsUnpublishCommand
    ): Observable<SimpleResponseDto<void>> {
        return this.useCase.unpublish({
            uniqId: command.uniqId,
        });
    }
}
