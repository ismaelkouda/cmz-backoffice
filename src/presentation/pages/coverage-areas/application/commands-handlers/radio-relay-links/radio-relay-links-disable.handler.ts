import { Injectable, inject } from '@angular/core';
import { RadioRelayLinksDisableCommand } from '@pages/coverage-areas/application/commands/radio-relay-links/radio-relay-links-disable.command';
import { radioRelayLinksDisableCommandMapper } from '@pages/coverage-areas/application/commands-mappers/radio-relay-links/radio-relay-links-disable.mapper';
import { RadioRelayLinksUseCase } from '@pages/coverage-areas/application/use-cases/radio-relay-links/radio-relay-links.use-case';
import { Observable } from 'rxjs';
import { MessageResponseDto } from '@shared/data/dto/simple-response.dto';

@Injectable({ providedIn: 'root' })
export class RadioRelayLinksDisableHandler {
    private readonly useCase = inject(RadioRelayLinksUseCase);

    execute(
        command: RadioRelayLinksDisableCommand
    ): Observable<MessageResponseDto> {
        return this.useCase.disable(
            radioRelayLinksDisableCommandMapper(command)
        );
    }
}
