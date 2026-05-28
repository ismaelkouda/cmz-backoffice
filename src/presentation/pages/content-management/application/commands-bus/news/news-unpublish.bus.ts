import { Injectable, inject } from '@angular/core';
import { NewsUnpublishCommand } from '@pages/content-management/application/commands/news/news-unpublish.command';
import { NewsUnpublishHandler } from '@pages/content-management/application/commands-handlers/news/news-unpublish.handler';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NewsUnpublishBus {
    private readonly filterHandler = inject(NewsUnpublishHandler);

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof NewsUnpublishCommand) {
            return this.filterHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
