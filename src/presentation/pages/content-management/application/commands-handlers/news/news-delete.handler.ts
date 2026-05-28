import { Injectable, inject } from '@angular/core';
import { NewsDeleteCommand } from '@pages/content-management/application/commands/news/news-delete.command';
import { NewsUseCase } from '@pages/content-management/application/use-cases/news/news.use-case';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NewsDeleteHandler {
    private readonly useCase = inject(NewsUseCase);

    execute(command: NewsDeleteCommand): Observable<SimpleResponseDto<void>> {
        return this.useCase.delete({
            uniqId: command.uniqId,
        });
    }
}
