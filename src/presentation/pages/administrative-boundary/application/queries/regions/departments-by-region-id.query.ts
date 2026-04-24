import { Status } from '@pages/administrative-boundary/domain/enums/departments/departments-status.enum';

export class DepartmentsByRegionIdQuery {
    constructor(
        public readonly uniqId: string,
        public readonly search?: string,
        public readonly municipality?: string,
        public readonly status?: Status,
        public readonly startDate?: string,
        public readonly endDate?: string
    ) {}
}
