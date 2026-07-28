import { Observable } from 'rxjs';
import { RadioRelayLinksFindOneEntity } from '@pages/coverage-areas/domain/entities/radio-relay-links/radio-relay-links-find-one.entity';
import { RadioRelayLinksFindOneFilterValidateContract } from '@pages/coverage-areas/domain/contracts/radio-relay-links/radio-relay-links-find-one-filter.validate-contract';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

export abstract class RadioRelayLinksFindOneRepository {
    abstract execute(
        filter: RadioRelayLinksFindOneFilterValidateContract,
        options?: FetchOptions
    ): Observable<RadioRelayLinksFindOneEntity>;
}
