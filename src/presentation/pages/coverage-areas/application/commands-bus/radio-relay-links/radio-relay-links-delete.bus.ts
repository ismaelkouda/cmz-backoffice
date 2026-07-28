import { Injectable, inject } from '@angular/core';
import { RadioRelayLinksDeleteCommand } from '@pages/coverage-areas/application/commands/radio-relay-links/radio-relay-links-delete.command';
import { RadioRelayLinksDeleteHandler } from '@pages/coverage-areas/application/commands-handlers/radio-relay-links/radio-relay-links-delete.handler';
import { Observable } from 'rxjs';
import { MessageResponseDto } from '@shared/data/dto/simple-response.dto';

@Injectable({ providedIn: 'root' })
export class RadioRelayLinksDeleteBus {
    private readonly handler = inject(RadioRelayLinksDeleteHandler);

    dispatch<T>(command: T): Observable<MessageResponseDto> {
        if (command instanceof RadioRelayLinksDeleteCommand) {
            return this.handler.execute(command);
        }
        throw new Error('No handler found for command');
    }
}
