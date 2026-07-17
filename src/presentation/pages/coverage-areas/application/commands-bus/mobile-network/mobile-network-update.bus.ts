import { Injectable, inject } from '@angular/core';
import { MobileNetworkUpdateCommand } from '@pages/coverage-areas/application/commands/mobile-network/mobile-network-update.command';
import { MobileNetworkUpdateHandler } from '@pages/coverage-areas/application/commands-handlers/mobile-network/mobile-network-update.handler';
import { MessageResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MobileNetworkUpdateBus {
    private readonly updateHandler = inject(MobileNetworkUpdateHandler);

    dispatch<T>(command: T): Observable<MessageResponseDto> {
        if (command instanceof MobileNetworkUpdateCommand) {
            return this.updateHandler.execute(command);
        }
        throw new Error('No handler found for command');
    }
}
