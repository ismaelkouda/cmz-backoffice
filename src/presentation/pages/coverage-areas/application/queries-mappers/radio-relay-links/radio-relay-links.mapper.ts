import { RadioRelayLinksQuery } from '@pages/coverage-areas/application/queries/radio-relay-links/radio-relay-links.query';
import { RadioRelayLinksFilterContract } from '@pages/coverage-areas/domain/contracts/radio-relay-links/radio-relay-links-filter.contract';
import { RadioRelayLinksOperator } from '@pages/coverage-areas/domain/enums/radio-relay-links/radio-relay-links-operator.enum';

export function radioRelayLinksQueryMapper(
    query: RadioRelayLinksQuery
): RadioRelayLinksFilterContract {
    return {
        search: query.search,
        operator: query.operator as RadioRelayLinksOperator,
        startDate: query.startDate ? new Date(query.startDate) : undefined,
        endDate: query.endDate ? new Date(query.endDate) : undefined,
    };
}
