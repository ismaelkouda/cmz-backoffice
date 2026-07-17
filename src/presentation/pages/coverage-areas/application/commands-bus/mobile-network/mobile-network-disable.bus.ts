import { Injectable, inject } from '@angular/core';
import { MobileNetworkDisableCommand } from '@pages/coverage-areas/application/commands/mobile-network/mobile-network-disable.command';
import { MobileNetworkDisableHandler } from '@pages/coverage-areas/application/commands-handlers/mobile-network/mobile-network-disable.handler';
import { MessageResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MobileNetworkDisableBus {
    private readonly disableHandler = inject(MobileNetworkDisableHandler);

    dispatch<T>(command: T): Observable<MessageResponseDto> {
        if (command instanceof MobileNetworkDisableCommand) {
            return this.disableHandler.execute(command);
        }
        throw new Error('No handler found for command');
    }
}
