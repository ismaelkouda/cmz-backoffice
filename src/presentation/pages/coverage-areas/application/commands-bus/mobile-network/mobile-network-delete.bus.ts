import { Injectable, inject } from '@angular/core';
import { MobileNetworkDeleteCommand } from '@pages/coverage-areas/application/commands/mobile-network/mobile-network-delete.command';
import { MobileNetworkDeleteHandler } from '@pages/coverage-areas/application/commands-handlers/mobile-network/mobile-network-delete.handler';
import { MessageResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MobileNetworkDeleteBus {
    private readonly deleteHandler = inject(MobileNetworkDeleteHandler);

    dispatch<T>(command: T): Observable<MessageResponseDto> {
        if (command instanceof MobileNetworkDeleteCommand) {
            return this.deleteHandler.execute(command);
        }
        throw new Error('No handler found for command');
    }
}
