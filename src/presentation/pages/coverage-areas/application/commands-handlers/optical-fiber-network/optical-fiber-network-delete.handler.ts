import { Injectable, inject } from '@angular/core';
import { opticalFiberNetworkDeleteCommandMapper } from '@pages/coverage-areas/application/commands-mappers/optical-fiber-network/optical-fiber-network-delete.mapper';
import { OpticalFiberNetworkDeleteCommand } from '@pages/coverage-areas/application/commands/optical-fiber-network/optical-fiber-network-delete.command';
import { OpticalFiberNetworkUseCase } from '@pages/coverage-areas/application/use-cases/optical-fiber-network/optical-fiber-network.use-case';
import { MessageResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OpticalFiberNetworkDeleteHandler {
    private readonly useCase = inject(OpticalFiberNetworkUseCase);

    execute(
        command: OpticalFiberNetworkDeleteCommand
    ): Observable<MessageResponseDto> {
        return this.useCase.delete(
            opticalFiberNetworkDeleteCommandMapper(command)
        );
    }
}
