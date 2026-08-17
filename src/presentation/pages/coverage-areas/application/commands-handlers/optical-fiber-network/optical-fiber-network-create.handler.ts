import { Injectable, inject } from '@angular/core';
import { opticalFiberNetworkCreateCommandMapper } from '@pages/coverage-areas/application/commands-mappers/optical-fiber-network/optical-fiber-network-create.mapper';
import { OpticalFiberNetworkCreateCommand } from '@pages/coverage-areas/application/commands/optical-fiber-network/optical-fiber-network-create.command';
import { OpticalFiberNetworkUseCase } from '@pages/coverage-areas/application/use-cases/optical-fiber-network/optical-fiber-network.use-case';
import { MessageResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OpticalFiberNetworkCreateHandler {
    private readonly useCase = inject(OpticalFiberNetworkUseCase);

    execute(
        command: OpticalFiberNetworkCreateCommand
    ): Observable<MessageResponseDto> {
        return this.useCase.create(
            opticalFiberNetworkCreateCommandMapper(command)
        );
    }
}
