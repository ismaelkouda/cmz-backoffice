import { Injectable, inject } from '@angular/core';
import { NewsCreateCommand } from '@pages/content-management/application/commands/news/news-create.command';
import { NewsUseCase } from '@pages/content-management/application/use-cases/news/news.use-case';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NewsCreateHandler {
    private readonly useCase = inject(NewsUseCase);

    execute(command: NewsCreateCommand): Observable<SimpleResponseDto<void>> {
        return this.useCase.create({ ...command });
    }
}
