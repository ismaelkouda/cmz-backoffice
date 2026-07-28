import { Injectable, inject } from '@angular/core';
import { RadioRelayLinksEnableCommand } from '@pages/coverage-areas/application/commands/radio-relay-links/radio-relay-links-enable.command';
import { RadioRelayLinksEnableHandler } from '@pages/coverage-areas/application/commands-handlers/radio-relay-links/radio-relay-links-enable.handler';
import { Observable } from 'rxjs';
import { MessageResponseDto } from '@shared/data/dto/simple-response.dto';

@Injectable({ providedIn: 'root' })
export class RadioRelayLinksEnableBus {
    private readonly handler = inject(RadioRelayLinksEnableHandler);

    dispatch<T>(command: T): Observable<MessageResponseDto> {
        if (command instanceof RadioRelayLinksEnableCommand) {
            return this.handler.execute(command);
        }
        throw new Error('No handler found for command');
    }
}
