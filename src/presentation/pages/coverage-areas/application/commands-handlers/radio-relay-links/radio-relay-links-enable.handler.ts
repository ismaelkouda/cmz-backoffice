import { Injectable, inject } from '@angular/core';
import { RadioRelayLinksEnableCommand } from '@pages/coverage-areas/application/commands/radio-relay-links/radio-relay-links-enable.command';
import { radioRelayLinksEnableCommandMapper } from '@pages/coverage-areas/application/commands-mappers/radio-relay-links/radio-relay-links-enable.mapper';
import { RadioRelayLinksUseCase } from '@pages/coverage-areas/application/use-cases/radio-relay-links/radio-relay-links.use-case';
import { Observable } from 'rxjs';
import { MessageResponseDto } from '@shared/data/dto/simple-response.dto';

@Injectable({ providedIn: 'root' })
export class RadioRelayLinksEnableHandler {
    private readonly useCase = inject(RadioRelayLinksUseCase);

    execute(
        command: RadioRelayLinksEnableCommand
    ): Observable<MessageResponseDto> {
        return this.useCase.enable(radioRelayLinksEnableCommandMapper(command));
    }
}
