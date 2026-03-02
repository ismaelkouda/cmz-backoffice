export class MunicipalitiesByDepartmentIdQuery {
    constructor(
        public readonly uniqId: string,
        public readonly search?: string,
        public readonly region?: string,
        public readonly department?: string,
        public readonly status?: string,
        public readonly startDate?: string,
        public readonly endDate?: string
    ) {}
}
