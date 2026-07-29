import { Injectable, inject } from '@angular/core';
import { RadioRelayLinksCreateCommand } from '@pages/coverage-areas/application/commands/radio-relay-links/radio-relay-links-create.command';
import { radioRelayLinksCreateCommandMapper } from '@pages/coverage-areas/application/commands-mappers/radio-relay-links/radio-relay-links-create.mapper';
import { RadioRelayLinksUseCase } from '@pages/coverage-areas/application/use-cases/radio-relay-links/radio-relay-links.use-case';
import { Observable } from 'rxjs';
import { MessageResponseDto } from '@shared/data/dto/simple-response.dto';

@Injectable({ providedIn: 'root' })
export class RadioRelayLinksCreateHandler {
    private readonly useCase = inject(RadioRelayLinksUseCase);

    execute(
        command: RadioRelayLinksCreateCommand
    ): Observable<MessageResponseDto> {
        return this.useCase.create(radioRelayLinksCreateCommandMapper(command));
    }
}
