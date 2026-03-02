import { Status } from '@presentation/pages/administrative-boundary/domain/enums/regions/regions-status.enum';

export class RegionsQuery {
    constructor(
        public readonly search?: string,
        public readonly department?: string,
        public readonly municipality?: string,
        public readonly status?: Status,
        public readonly startDate?: string,
        public readonly endDate?: string
    ) {}
}
