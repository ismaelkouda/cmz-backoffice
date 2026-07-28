import { Injectable, inject } from '@angular/core';
import { opticalFiberNetworkUpdateCommandMapper } from '@pages/coverage-areas/application/commands-mappers/optical-fiber-network/optical-fiber-network-update.mapper';
import { OpticalFiberNetworkUpdateCommand } from '@pages/coverage-areas/application/commands/optical-fiber-network/optical-fiber-network-update.command';
import { OpticalFiberNetworkUseCase } from '@pages/coverage-areas/application/use-cases/optical-fiber-network/optical-fiber-network.use-case';
import { MessageResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OpticalFiberNetworkUpdateHandler {
    private readonly useCase = inject(OpticalFiberNetworkUseCase);

    execute(
        command: OpticalFiberNetworkUpdateCommand
    ): Observable<MessageResponseDto> {
        return this.useCase.update(
            opticalFiberNetworkUpdateCommandMapper(command)
        );
    }
}
