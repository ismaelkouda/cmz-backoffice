import { Injectable, inject } from '@angular/core';
import { NewsCreateCommand } from '@pages/content-management/application/commands/news/news-create.command';
import { NewsCreateHandler } from '@pages/content-management/application/commands-handlers/news/news-create.handler';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NewsCreateBus {
    private readonly createHandler = inject(NewsCreateHandler);

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof NewsCreateCommand) {
            return this.createHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
