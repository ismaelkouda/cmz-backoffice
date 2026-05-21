export class DepartmentsQuery {
    constructor(
        public readonly search: string | null,
        public readonly region: string | null,
        public readonly startDate: string | null,
        public readonly endDate: string | null
    ) {}
}
