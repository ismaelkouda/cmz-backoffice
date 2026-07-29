import { Injectable, inject } from '@angular/core';
import { RadioRelayLinksDeleteCommand } from '@pages/coverage-areas/application/commands/radio-relay-links/radio-relay-links-delete.command';
import { radioRelayLinksDeleteCommandMapper } from '@pages/coverage-areas/application/commands-mappers/radio-relay-links/radio-relay-links-delete.mapper';
import { RadioRelayLinksUseCase } from '@pages/coverage-areas/application/use-cases/radio-relay-links/radio-relay-links.use-case';
import { Observable } from 'rxjs';
import { MessageResponseDto } from '@shared/data/dto/simple-response.dto';

@Injectable({ providedIn: 'root' })
export class RadioRelayLinksDeleteHandler {
    private readonly useCase = inject(RadioRelayLinksUseCase);

    execute(
        command: RadioRelayLinksDeleteCommand
    ): Observable<MessageResponseDto> {
        return this.useCase.delete(radioRelayLinksDeleteCommandMapper(command));
    }
}
