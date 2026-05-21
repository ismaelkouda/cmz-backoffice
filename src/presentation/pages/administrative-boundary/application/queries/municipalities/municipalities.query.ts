import { Status } from '@pages/administrative-boundary/domain/enums/municipalities/municipalities-status.enum';

export class MunicipalitiesQuery {
    constructor(
        public readonly search: string | null,
        public readonly region: string | null,
        public readonly department: string | null,
        public readonly startDate: string | null,
        public readonly endDate: string | null
    ) {}
}
