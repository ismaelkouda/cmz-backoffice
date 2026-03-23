import { Injectable } from '@angular/core';
import { NewsPublishCommand } from '@presentation/pages/content-management/application/commands/news/news-publish.command';
import { NewsPublishHandler } from '@presentation/pages/content-management/application/commands-handlers/news/news-publish.handler';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NewsPublishBus {
    constructor(private readonly filterHandler: NewsPublishHandler) {}

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof NewsPublishCommand) {
            return this.filterHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
