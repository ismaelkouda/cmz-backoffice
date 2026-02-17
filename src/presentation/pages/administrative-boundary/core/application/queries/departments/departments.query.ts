export class DepartmentsQuery {
    constructor(
        public readonly search?: string,
        public readonly regionId?: string,
        public readonly municipalityId?: string,
        public readonly isActive?: string,
        public readonly startDate?: string,
        public readonly endDate?: string
    ) {}
}
