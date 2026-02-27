import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { NewsDeleteCommand } from '@presentation/pages/content-management/application/commands/news/news-delete.command';
import { NewsDeleteHandler } from '@presentation/pages/content-management/application/commands-handlers/news/news-delete.handler';

@Injectable({ providedIn: 'root' })
export class NewsDeleteBus {
    constructor(private readonly filterHandler: NewsDeleteHandler) {}

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof NewsDeleteCommand) {
            return this.filterHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
