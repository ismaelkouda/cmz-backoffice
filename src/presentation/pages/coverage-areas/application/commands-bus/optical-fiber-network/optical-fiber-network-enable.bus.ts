import { Injectable, inject } from '@angular/core';
import { OpticalFiberNetworkEnableCommand } from '@pages/coverage-areas/application/commands/optical-fiber-network/optical-fiber-network-enable.command';
import { OpticalFiberNetworkEnableHandler } from '@pages/coverage-areas/application/commands-handlers/optical-fiber-network/optical-fiber-network-enable.handler';
import { MessageResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OpticalFiberNetworkEnableBus {
    private readonly handler = inject(OpticalFiberNetworkEnableHandler);

    dispatch<T>(command: T): Observable<MessageResponseDto> {
        if (command instanceof OpticalFiberNetworkEnableCommand) {
            return this.handler.execute(command);
        }
        throw new Error('No handler found for command');
    }
}
