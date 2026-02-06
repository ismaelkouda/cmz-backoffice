export class TeamsParticipantsFilterCommand {
    constructor(
        public readonly uniqId: string,
        public readonly search: string,
        public readonly participantEmail: string,
        public readonly phone: string
    ) {}
}
