import { Injectable, inject } from '@angular/core';
import { MobileNetworkCreateCommand } from '@pages/coverage-areas/application/commands/mobile-network/mobile-network-create.command';
import { MobileNetworkCreateHandler } from '@pages/coverage-areas/application/commands-handlers/mobile-network/mobile-network-create.handler';
import { MessageResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MobileNetworkCreateBus {
    private readonly createHandler = inject(MobileNetworkCreateHandler);

    dispatch<T>(command: T): Observable<MessageResponseDto> {
        if (command instanceof MobileNetworkCreateCommand) {
            return this.createHandler.execute(command);
        }
        throw new Error('No handler found for command');
    }
}
