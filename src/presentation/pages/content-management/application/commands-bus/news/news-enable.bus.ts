import { Injectable } from '@angular/core';
import { NewsEnableCommand } from '@pages/content-management/application/commands/news/news-enable.command';
import { NewsEnableHandler } from '@pages/content-management/application/commands-handlers/news/news-enable.handler';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

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
