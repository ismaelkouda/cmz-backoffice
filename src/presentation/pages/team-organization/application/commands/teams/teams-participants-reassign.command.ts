export class TeamsParticipantsReassignCommand {
    constructor(
        public readonly uniqId: string,
        public readonly participants: string[]
    ) {}
}
