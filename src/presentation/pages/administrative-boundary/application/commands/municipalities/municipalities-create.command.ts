export class MunicipalitiesCreateCommand {
    constructor(
        public readonly code: string,
        public readonly name: string,
        public readonly region: string,
        public readonly description: string,
        public readonly department?: string
    ) {}
}
