import { RadioRelayLinksCreateCommand } from '@pages/coverage-areas/application/commands/radio-relay-links/radio-relay-links-create.command';
import { radioRelayLinksCreateCommandMapper } from '@pages/coverage-areas/application/commands-mappers/radio-relay-links/radio-relay-links-create.mapper';
import { RadioRelayLinksUseCase } from '@pages/coverage-areas/application/use-cases/radio-relay-links/radio-relay-links.use-case';
import { Observable } from 'rxjs';
import { MessageResponseDto } from '@shared/data/dto/simple-response.dto';

export class RadioRelayLinksCreateHandler {
    constructor(private readonly useCase: RadioRelayLinksUseCase) {}

    execute(
        command: RadioRelayLinksCreateCommand
    ): Observable<MessageResponseDto> {
        return this.useCase.create(radioRelayLinksCreateCommandMapper(command));
    }
}
