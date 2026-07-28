import { Injectable, inject } from '@angular/core';
import { RadioRelayLinksDisableCommand } from '@pages/coverage-areas/application/commands/radio-relay-links/radio-relay-links-disable.command';
import { RadioRelayLinksDisableHandler } from '@pages/coverage-areas/application/commands-handlers/radio-relay-links/radio-relay-links-disable.handler';
import { Observable } from 'rxjs';
import { MessageResponseDto } from '@shared/data/dto/simple-response.dto';

@Injectable({ providedIn: 'root' })
export class RadioRelayLinksDisableBus {
    private readonly handler = inject(RadioRelayLinksDisableHandler);

    dispatch<T>(command: T): Observable<MessageResponseDto> {
        if (command instanceof RadioRelayLinksDisableCommand) {
            return this.handler.execute(command);
        }
        throw new Error('No handler found for command');
    }
}
