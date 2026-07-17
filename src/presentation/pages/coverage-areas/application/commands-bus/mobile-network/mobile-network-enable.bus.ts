import { Injectable, inject } from '@angular/core';
import { MobileNetworkEnableCommand } from '@pages/coverage-areas/application/commands/mobile-network/mobile-network-enable.command';
import { MobileNetworkEnableHandler } from '@pages/coverage-areas/application/commands-handlers/mobile-network/mobile-network-enable.handler';
import { MessageResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MobileNetworkEnableBus {
    private readonly enableHandler = inject(MobileNetworkEnableHandler);

    dispatch<T>(command: T): Observable<MessageResponseDto> {
        if (command instanceof MobileNetworkEnableCommand) {
            return this.enableHandler.execute(command);
        }
        throw new Error('No handler found for command');
    }
}
