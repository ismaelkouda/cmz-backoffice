import { RadioRelayLinksFindOneQuery } from '@pages/coverage-areas/application/queries/radio-relay-links/radio-relay-links-find-one.query';
import { radioRelayLinksFindOneQueryMapper } from '@pages/coverage-areas/application/queries-mappers/radio-relay-links/radio-relay-links-find-one.mapper';
import { RadioRelayLinksFindOneUseCase } from '@pages/coverage-areas/application/use-cases/radio-relay-links/radio-relay-links-find-one.use-case';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';
import { RadioRelayLinksFindOneEntity } from '@presentation/pages/coverage-areas/domain/entities/radio-relay-links/radio-relay-links-find-one.entity';

export class RadioRelayLinksFindOneHandler {
    constructor(private readonly useCase: RadioRelayLinksFindOneUseCase) {}

    execute(
        query: RadioRelayLinksFindOneQuery,
        options?: FetchOptions
    ): Observable<RadioRelayLinksFindOneEntity> {
        const contract = radioRelayLinksFindOneQueryMapper(query);
        return this.useCase.execute(contract, options);
    }
}
