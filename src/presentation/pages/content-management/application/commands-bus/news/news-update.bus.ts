import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { NewsUpdateCommand } from '@presentation/pages/content-management/application/commands/news/news-update.command';
import { NewsUpdateHandler } from '@presentation/pages/content-management/application/commands-handlers/news/news-update.handler';

@Injectable({ providedIn: 'root' })
export class NewsUpdateBus {
    constructor(private readonly updateHandler: NewsUpdateHandler) {}

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof NewsUpdateCommand) {
            return this.updateHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
