import { Injectable, inject } from '@angular/core';
import { mobileNetworkDeleteCommandMapper } from '@pages/coverage-areas/application/commands-mappers/mobile-network/mobile-network-delete.mapper';
import { MobileNetworkDeleteCommand } from '@pages/coverage-areas/application/commands/mobile-network/mobile-network-delete.command';
import { MobileNetworkUseCase } from '@pages/coverage-areas/application/use-cases/mobile-network/mobile-network.use-case';
import { MessageResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MobileNetworkDeleteHandler {
    private readonly useCase = inject(MobileNetworkUseCase);

    execute(command: MobileNetworkDeleteCommand): Observable<MessageResponseDto> {
        return this.useCase.delete(mobileNetworkDeleteCommandMapper(command));
    }
}
