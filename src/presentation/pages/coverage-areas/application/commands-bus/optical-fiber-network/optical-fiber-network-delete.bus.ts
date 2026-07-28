import { Injectable, inject } from '@angular/core';
import { OpticalFiberNetworkDeleteCommand } from '@pages/coverage-areas/application/commands/optical-fiber-network/optical-fiber-network-delete.command';
import { OpticalFiberNetworkDeleteHandler } from '@pages/coverage-areas/application/commands-handlers/optical-fiber-network/optical-fiber-network-delete.handler';
import { MessageResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OpticalFiberNetworkDeleteBus {
    private readonly handler = inject(OpticalFiberNetworkDeleteHandler);

    dispatch<T>(command: T): Observable<MessageResponseDto> {
        if (command instanceof OpticalFiberNetworkDeleteCommand) {
            return this.handler.execute(command);
        }
        throw new Error('No handler found for command');
    }
}
