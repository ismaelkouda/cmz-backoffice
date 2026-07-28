import { Injectable, inject } from '@angular/core';
import { OpticalFiberNetworkUpdateCommand } from '@pages/coverage-areas/application/commands/optical-fiber-network/optical-fiber-network-update.command';
import { OpticalFiberNetworkUpdateHandler } from '@pages/coverage-areas/application/commands-handlers/optical-fiber-network/optical-fiber-network-update.handler';
import { MessageResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OpticalFiberNetworkUpdateBus {
    private readonly handler = inject(OpticalFiberNetworkUpdateHandler);

    dispatch<T>(command: T): Observable<MessageResponseDto> {
        if (command instanceof OpticalFiberNetworkUpdateCommand) {
            return this.handler.execute(command);
        }
        throw new Error('No handler found for command');
    }
}
