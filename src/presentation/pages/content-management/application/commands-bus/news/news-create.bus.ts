import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { NewsCreateCommand } from '@presentation/pages/content-management/application/commands/news/news-create.command';
import { NewsCreateHandler } from '@presentation/pages/content-management/application/commands-handlers/news/news-create.handler';

@Injectable({ providedIn: 'root' })
export class NewsCreateBus {
    constructor(private readonly createHandler: NewsCreateHandler) {}

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof NewsCreateCommand) {
            return this.createHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
