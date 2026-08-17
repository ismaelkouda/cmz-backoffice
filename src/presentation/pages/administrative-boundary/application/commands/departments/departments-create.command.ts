export class DepartmentsCreateCommand {
    constructor(
        public readonly code: string,
        public readonly population: number,
        public readonly infrastructure: number,
        public readonly name: string,
        public readonly region: string,
        public readonly description: string
    ) {}
}
