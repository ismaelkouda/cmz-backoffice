import { SlaFilterContract } from '@pages/sla/domain/contracts/sla/sla-filter.contract';
import { SlaQuery } from '@pages/sla/application/queries/sla/sla.query';

export const slaQueryMapper = (query: SlaQuery): SlaFilterContract => ({
    search: query.search,
    category: query.category,
});
