import { Injectable, inject } from '@angular/core';
import { NewsDeleteCommand } from '@pages/content-management/application/commands/news/news-delete.command';
import { NewsDeleteHandler } from '@pages/content-management/application/commands-handlers/news/news-delete.handler';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NewsDeleteBus {
    private readonly filterHandler = inject(NewsDeleteHandler);

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof NewsDeleteCommand) {
            return this.filterHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
