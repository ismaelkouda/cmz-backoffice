import { Injectable, inject } from '@angular/core';
import { SiteGroupUpdateCommand } from '@pages/coverage-areas/application/commands/site-group/site-group-update.command';
import { SiteGroupUpdateHandler } from '@pages/coverage-areas/application/commands-handlers/site-group/site-group-update.handler';
import { MessageResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SiteGroupUpdateBus {
    private readonly updateHandler = inject(SiteGroupUpdateHandler);

    dispatch<T>(command: T): Observable<MessageResponseDto> {
        if (command instanceof SiteGroupUpdateCommand) {
            return this.updateHandler.execute(command);
        }
        throw new Error('No handler found for command');
    }
}
