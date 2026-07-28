import { Injectable, inject } from '@angular/core';
import { mobileNetworkCreateCommandMapper } from '@pages/coverage-areas/application/commands-mappers/mobile-network/mobile-network-create.mapper';
import { MobileNetworkCreateCommand } from '@pages/coverage-areas/application/commands/mobile-network/mobile-network-create.command';
import { MobileNetworkUseCase } from '@pages/coverage-areas/application/use-cases/mobile-network/mobile-network.use-case';
import { MessageResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MobileNetworkCreateHandler {
    private readonly useCase = inject(MobileNetworkUseCase);

    execute(
        command: MobileNetworkCreateCommand
    ): Observable<MessageResponseDto> {
        return this.useCase.create(mobileNetworkCreateCommandMapper(command));
    }
}
