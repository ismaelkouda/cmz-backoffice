import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { NewsEnableCommand } from '@presentation/pages/content-management/application/commands/news/news-enable.command';
import { NewsEnableHandler } from '@presentation/pages/content-management/application/commands-handlers/news/news-enable.handler';

@Injectable({ providedIn: 'root' })
export class NewsEnableBus {
    constructor(private readonly filterHandler: NewsEnableHandler) {}

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof NewsEnableCommand) {
            return this.filterHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
