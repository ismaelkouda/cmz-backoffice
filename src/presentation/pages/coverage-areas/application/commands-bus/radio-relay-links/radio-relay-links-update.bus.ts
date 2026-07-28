import { Injectable, inject } from '@angular/core';
import { RadioRelayLinksUpdateCommand } from '@pages/coverage-areas/application/commands/radio-relay-links/radio-relay-links-update.command';
import { RadioRelayLinksUpdateHandler } from '@pages/coverage-areas/application/commands-handlers/radio-relay-links/radio-relay-links-update.handler';
import { Observable } from 'rxjs';
import { MessageResponseDto } from '@shared/data/dto/simple-response.dto';

@Injectable({ providedIn: 'root' })
export class RadioRelayLinksUpdateBus {
    private readonly handler = inject(RadioRelayLinksUpdateHandler);

    dispatch<T>(command: T): Observable<MessageResponseDto> {
        if (command instanceof RadioRelayLinksUpdateCommand) {
            return this.handler.execute(command);
        }
        throw new Error('No handler found for command');
    }
}
