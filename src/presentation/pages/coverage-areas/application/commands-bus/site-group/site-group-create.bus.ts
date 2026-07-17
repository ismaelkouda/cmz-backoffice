import { Injectable, inject } from '@angular/core';
import { SiteGroupCreateCommand } from '@pages/coverage-areas/application/commands/site-group/site-group-create.command';
import { SiteGroupCreateHandler } from '@pages/coverage-areas/application/commands-handlers/site-group/site-group-create.handler';
import { MessageResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SiteGroupCreateBus {
    private readonly createHandler = inject(SiteGroupCreateHandler);

    dispatch<T>(command: T): Observable<MessageResponseDto> {
        if (command instanceof SiteGroupCreateCommand) {
            return this.createHandler.execute(command);
        }
        throw new Error('No handler found for command');
    }
}
