import { RadioRelayLinksQuery } from '@pages/coverage-areas/application/queries/radio-relay-links/radio-relay-links.query';
import { radioRelayLinksQueryMapper } from '@pages/coverage-areas/application/queries-mappers/radio-relay-links/radio-relay-links.mapper';
import { RadioRelayLinksUseCase } from '@pages/coverage-areas/application/use-cases/radio-relay-links/radio-relay-links.use-case';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';
import { RadioRelayLinksEntity } from '@presentation/pages/coverage-areas/domain/entities/radio-relay-links/radio-relay-links.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';

export class RadioRelayLinksHandler {
    constructor(private readonly useCase: RadioRelayLinksUseCase) {}

    execute(
        query: RadioRelayLinksQuery,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<RadioRelayLinksEntity>> {
        const contract = radioRelayLinksQueryMapper(query);
        return this.useCase.execute(contract, page, options);
    }
}
