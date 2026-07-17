import { Injectable, inject } from '@angular/core';
import { SiteGroupEnableCommand } from '@pages/coverage-areas/application/commands/site-group/site-group-enable.command';
import { SiteGroupEnableHandler } from '@pages/coverage-areas/application/commands-handlers/site-group/site-group-enable.handler';
import { MessageResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SiteGroupEnableBus {
    private readonly enableHandler = inject(SiteGroupEnableHandler);

    dispatch<T>(command: T): Observable<MessageResponseDto> {
        if (command instanceof SiteGroupEnableCommand) {
            return this.enableHandler.execute(command);
        }
        throw new Error('No handler found for command');
    }
}
