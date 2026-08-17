import { Injectable, inject } from '@angular/core';
import { NewsUpdateCommand } from '@pages/content-management/application/commands/news/news-update.command';
import { NewsUpdateHandler } from '@pages/content-management/application/commands-handlers/news/news-update.handler';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NewsUpdateBus {
    private readonly updateHandler = inject(NewsUpdateHandler);

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof NewsUpdateCommand) {
            return this.updateHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
