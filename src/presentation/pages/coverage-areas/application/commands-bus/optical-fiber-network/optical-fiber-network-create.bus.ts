import { Injectable, inject } from '@angular/core';
import { OpticalFiberNetworkCreateCommand } from '@pages/coverage-areas/application/commands/optical-fiber-network/optical-fiber-network-create.command';
import { OpticalFiberNetworkCreateHandler } from '@pages/coverage-areas/application/commands-handlers/optical-fiber-network/optical-fiber-network-create.handler';
import { MessageResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OpticalFiberNetworkCreateBus {
    private readonly handler = inject(OpticalFiberNetworkCreateHandler);

    dispatch<T>(command: T): Observable<MessageResponseDto> {
        if (command instanceof OpticalFiberNetworkCreateCommand) {
            return this.handler.execute(command);
        }
        throw new Error('No handler found for command');
    }
}
