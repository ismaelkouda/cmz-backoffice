import { Injectable, inject } from '@angular/core';
import { mobileNetworkDisableCommandMapper } from '@pages/coverage-areas/application/commands-mappers/mobile-network/mobile-network-disable.mapper';
import { MobileNetworkDisableCommand } from '@pages/coverage-areas/application/commands/mobile-network/mobile-network-disable.command';
import { MobileNetworkUseCase } from '@pages/coverage-areas/application/use-cases/mobile-network/mobile-network.use-case';
import { MessageResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MobileNetworkDisableHandler {
    private readonly useCase = inject(MobileNetworkUseCase);

    execute(command: MobileNetworkDisableCommand): Observable<MessageResponseDto> {
        return this.useCase.disable(mobileNetworkDisableCommandMapper(command));
    }
}
