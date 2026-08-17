import { Injectable, inject } from '@angular/core';
import { SiteGroupDeleteCommand } from '@pages/coverage-areas/application/commands/site-group/site-group-delete.command';
import { SiteGroupDeleteHandler } from '@pages/coverage-areas/application/commands-handlers/site-group/site-group-delete.handler';
import { MessageResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SiteGroupDeleteBus {
    private readonly deleteHandler = inject(SiteGroupDeleteHandler);

    dispatch<T>(command: T): Observable<MessageResponseDto> {
        if (command instanceof SiteGroupDeleteCommand) {
            return this.deleteHandler.execute(command);
        }
        throw new Error('No handler found for command');
    }
}
