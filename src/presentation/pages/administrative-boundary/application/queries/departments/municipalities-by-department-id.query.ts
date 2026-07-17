import { Status } from '@pages/administrative-boundary/domain/enums/municipalities/municipalities-status.enum';

export class MunicipalitiesByDepartmentIdQuery {
    constructor(
        public readonly uniqId?: string,
        public readonly search?: string,
        public readonly region?: string,
        public readonly department?: string,
        public readonly status?: Status,
        public readonly startDate?: string,
        public readonly endDate?: string
    ) {}
}
