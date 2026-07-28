import { RadioRelayLinksFindOneQuery } from '@pages/coverage-areas/application/queries/radio-relay-links/radio-relay-links-find-one.query';
import { RadioRelayLinksFindOneFilterContract } from '@pages/coverage-areas/domain/contracts/radio-relay-links/radio-relay-links-find-one-filter.contract';

export function radioRelayLinksFindOneQueryMapper(
    query: RadioRelayLinksFindOneQuery
): RadioRelayLinksFindOneFilterContract {
    return query;
}
