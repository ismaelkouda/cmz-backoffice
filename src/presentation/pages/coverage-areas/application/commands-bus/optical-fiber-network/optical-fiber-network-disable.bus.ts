import { Injectable, inject } from '@angular/core';
import { OpticalFiberNetworkDisableCommand } from '@pages/coverage-areas/application/commands/optical-fiber-network/optical-fiber-network-disable.command';
import { OpticalFiberNetworkDisableHandler } from '@pages/coverage-areas/application/commands-handlers/optical-fiber-network/optical-fiber-network-disable.handler';
import { MessageResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OpticalFiberNetworkDisableBus {
    private readonly handler = inject(OpticalFiberNetworkDisableHandler);

    dispatch<T>(command: T): Observable<MessageResponseDto> {
        if (command instanceof OpticalFiberNetworkDisableCommand) {
            return this.handler.execute(command);
        }
        throw new Error('No handler found for command');
    }
}
