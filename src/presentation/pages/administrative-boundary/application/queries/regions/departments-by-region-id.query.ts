export class DepartmentsByRegionIdQuery {
    constructor(
        public readonly uniqId: string,
        public readonly search?: string,
        public readonly municipality?: string,
        public readonly status?: string,
        public readonly startDate?: string,
        public readonly endDate?: string
    ) {}
}
