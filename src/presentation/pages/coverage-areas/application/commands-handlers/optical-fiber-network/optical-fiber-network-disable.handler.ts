import { Injectable, inject } from '@angular/core';
import { opticalFiberNetworkDisableCommandMapper } from '@pages/coverage-areas/application/commands-mappers/optical-fiber-network/optical-fiber-network-disable.mapper';
import { OpticalFiberNetworkDisableCommand } from '@pages/coverage-areas/application/commands/optical-fiber-network/optical-fiber-network-disable.command';
import { OpticalFiberNetworkUseCase } from '@pages/coverage-areas/application/use-cases/optical-fiber-network/optical-fiber-network.use-case';
import { MessageResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OpticalFiberNetworkDisableHandler {
    private readonly useCase = inject(OpticalFiberNetworkUseCase);

    execute(
        command: OpticalFiberNetworkDisableCommand
    ): Observable<MessageResponseDto> {
        return this.useCase.disable(
            opticalFiberNetworkDisableCommandMapper(command)
        );
    }
}
