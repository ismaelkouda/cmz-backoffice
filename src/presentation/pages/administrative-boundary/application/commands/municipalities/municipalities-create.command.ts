export class MunicipalitiesCreateCommand {
    constructor(
        public readonly code: string,
        public readonly name: string,
        public readonly department: string,
        public readonly description: string
    ) {}
}
