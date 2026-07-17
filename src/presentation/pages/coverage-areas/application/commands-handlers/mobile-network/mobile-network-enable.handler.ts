import { Injectable, inject } from '@angular/core';
import { mobileNetworkEnableCommandMapper } from '@pages/coverage-areas/application/commands-mappers/mobile-network/mobile-network-enable.mapper';
import { MobileNetworkEnableCommand } from '@pages/coverage-areas/application/commands/mobile-network/mobile-network-enable.command';
import { MobileNetworkUseCase } from '@pages/coverage-areas/application/use-cases/mobile-network/mobile-network.use-case';
import { MessageResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MobileNetworkEnableHandler {
    private readonly useCase = inject(MobileNetworkUseCase);

    execute(command: MobileNetworkEnableCommand): Observable<MessageResponseDto> {
        return this.useCase.enable(mobileNetworkEnableCommandMapper(command));
    }
}
