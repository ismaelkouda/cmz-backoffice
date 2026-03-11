import { Injectable } from '@angular/core';
import { NewsEnableCommand } from '@pages/content-management/application/commands/news/news-enable.command';
import { NewsUseCase } from '@pages/content-management/application/use-cases/news/news.use-case';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NewsEnableHandler {
    constructor(private readonly useCase: NewsUseCase) {}

    execute(command: NewsEnableCommand): Observable<SimpleResponseDto<void>> {
        return this.useCase.enable({
            uniqId: command.uniqId,
        });
    }
}
