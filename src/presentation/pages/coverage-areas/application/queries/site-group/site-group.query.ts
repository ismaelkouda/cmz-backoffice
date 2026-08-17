import { Status } from '@pages/coverage-areas/domain/enums/site-group/site-group-status.enum';

export class SiteGroupQuery {
    constructor(
        public readonly search?: string,
        public readonly status?: Status,
        public readonly startDate?: Date,
        public readonly endDate?: Date
    ) {}
}
