import { Injectable, inject } from '@angular/core';
import { opticalFiberNetworkEnableCommandMapper } from '@pages/coverage-areas/application/commands-mappers/optical-fiber-network/optical-fiber-network-enable.mapper';
import { OpticalFiberNetworkEnableCommand } from '@pages/coverage-areas/application/commands/optical-fiber-network/optical-fiber-network-enable.command';
import { OpticalFiberNetworkUseCase } from '@pages/coverage-areas/application/use-cases/optical-fiber-network/optical-fiber-network.use-case';
import { MessageResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OpticalFiberNetworkEnableHandler {
    private readonly useCase = inject(OpticalFiberNetworkUseCase);

    execute(
        command: OpticalFiberNetworkEnableCommand
    ): Observable<MessageResponseDto> {
        return this.useCase.enable(
            opticalFiberNetworkEnableCommandMapper(command)
        );
    }
}
