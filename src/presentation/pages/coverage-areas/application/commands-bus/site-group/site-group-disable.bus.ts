import { Injectable, inject } from '@angular/core';
import { SiteGroupDisableCommand } from '@pages/coverage-areas/application/commands/site-group/site-group-disable.command';
import { SiteGroupDisableHandler } from '@pages/coverage-areas/application/commands-handlers/site-group/site-group-disable.handler';
import { MessageResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SiteGroupDisableBus {
    private readonly disableHandler = inject(SiteGroupDisableHandler);

    dispatch<T>(command: T): Observable<MessageResponseDto> {
        if (command instanceof SiteGroupDisableCommand) {
            return this.disableHandler.execute(command);
        }
        throw new Error('No handler found for command');
    }
}
