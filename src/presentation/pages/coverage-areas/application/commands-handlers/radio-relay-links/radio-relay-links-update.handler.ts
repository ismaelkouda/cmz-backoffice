import { RadioRelayLinksUpdateCommand } from '@pages/coverage-areas/application/commands/radio-relay-links/radio-relay-links-update.command';
import { radioRelayLinksUpdateCommandMapper } from '@pages/coverage-areas/application/commands-mappers/radio-relay-links/radio-relay-links-update.mapper';
import { RadioRelayLinksUseCase } from '@pages/coverage-areas/application/use-cases/radio-relay-links/radio-relay-links.use-case';
import { Observable } from 'rxjs';
import { MessageResponseDto } from '@shared/data/dto/simple-response.dto';

export class RadioRelayLinksUpdateHandler {
    constructor(private readonly useCase: RadioRelayLinksUseCase) {}

    execute(
        command: RadioRelayLinksUpdateCommand
    ): Observable<MessageResponseDto> {
        return this.useCase.update(radioRelayLinksUpdateCommandMapper(command));
    }
}
