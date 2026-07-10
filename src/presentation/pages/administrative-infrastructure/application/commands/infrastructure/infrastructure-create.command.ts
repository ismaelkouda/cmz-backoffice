export class InfrastructureCreateCommand {
    constructor(
        public readonly name: string,
        public readonly type: string,
        public readonly description: string,
        public readonly region: string,
        public readonly department: string,
        public readonly municipality: string,
        public readonly position: string
    ) {}
}
