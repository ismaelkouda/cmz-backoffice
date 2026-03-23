import { Injectable } from '@angular/core';
import { NewsUnpublishCommand } from '@presentation/pages/content-management/application/commands/news/news-unpublish.command';
import { NewsUnpublishHandler } from '@presentation/pages/content-management/application/commands-handlers/news/news-unpublish.handler';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NewsUnpublishBus {
    constructor(private readonly filterHandler: NewsUnpublishHandler) {}

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof NewsUnpublishCommand) {
            return this.filterHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
