import { Injectable, inject } from '@angular/core';
import { NewsPublishCommand } from '@pages/content-management/application/commands/news/news-publish.command';
import { NewsPublishHandler } from '@pages/content-management/application/commands-handlers/news/news-publish.handler';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NewsPublishBus {
    private readonly filterHandler = inject(NewsPublishHandler);

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof NewsPublishCommand) {
            return this.filterHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
