import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { NewsDisableCommand } from '@presentation/pages/content-management/application/commands/news/news-disable.command';
import { NewsDisableHandler } from '@presentation/pages/content-management/application/commands-handlers/news/news-disable.handler';

@Injectable({ providedIn: 'root' })
export class NewsDisableBus {
    constructor(private readonly filterHandler: NewsDisableHandler) {}

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof NewsDisableCommand) {
            return this.filterHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
