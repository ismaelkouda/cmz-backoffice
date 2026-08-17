import { Injectable, inject } from '@angular/core';
import { mobileNetworkUpdateCommandMapper } from '@pages/coverage-areas/application/commands-mappers/mobile-network/mobile-network-update.mapper';
import { MobileNetworkUpdateCommand } from '@pages/coverage-areas/application/commands/mobile-network/mobile-network-update.command';
import { MobileNetworkUseCase } from '@pages/coverage-areas/application/use-cases/mobile-network/mobile-network.use-case';
import { MessageResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MobileNetworkUpdateHandler {
    private readonly useCase = inject(MobileNetworkUseCase);

    execute(
        command: MobileNetworkUpdateCommand
    ): Observable<MessageResponseDto> {
        return this.useCase.update(mobileNetworkUpdateCommandMapper(command));
    }
}
