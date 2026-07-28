import { Injectable, inject } from '@angular/core';
import { RadioRelayLinksCreateCommand } from '@pages/coverage-areas/application/commands/radio-relay-links/radio-relay-links-create.command';
import { RadioRelayLinksCreateHandler } from '@pages/coverage-areas/application/commands-handlers/radio-relay-links/radio-relay-links-create.handler';
import { Observable } from 'rxjs';
import { MessageResponseDto } from '@shared/data/dto/simple-response.dto';

@Injectable({ providedIn: 'root' })
export class RadioRelayLinksCreateBus {
    private readonly handler = inject(RadioRelayLinksCreateHandler);

    dispatch<T>(command: T): Observable<MessageResponseDto> {
        if (command instanceof RadioRelayLinksCreateCommand) {
            return this.handler.execute(command);
        }
        throw new Error('No handler found for command');
    }
}
