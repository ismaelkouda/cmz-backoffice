import { Status } from '@presentation/pages/administrative-boundary/domain/enums/departments/departments-status.enum';

export class DepartmentsQuery {
    constructor(
        public readonly search?: string,
        public readonly region?: string,
        public readonly municipality?: string,
        public readonly status?: Status,
        public readonly startDate?: string,
        public readonly endDate?: string
    ) {}
}
