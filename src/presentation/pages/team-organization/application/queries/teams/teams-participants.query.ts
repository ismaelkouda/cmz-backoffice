export class TeamsParticipantsQuery {
    constructor(
        public readonly uniqId: string,
        public readonly search?: string
    ) {}
}
