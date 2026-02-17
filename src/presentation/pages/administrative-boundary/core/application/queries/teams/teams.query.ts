export class TeamsQuery {
    constructor(
        public readonly search?: string,
        public readonly member?: string,
        public readonly isActive?: string
    ) {}
}
