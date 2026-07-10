export class InfrastructureQuery {
    constructor(
        public readonly search?: string,
        public readonly type?: string,
        public readonly region?: string,
        public readonly department?: string,
        public readonly municipality?: string,
        public readonly position?: string
    ) {}
}
