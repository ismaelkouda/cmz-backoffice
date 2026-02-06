export class TeamsParticipantsAssignCommand {
    constructor(
        public readonly uniqId: string,
        public readonly participants: string[]
    ) {}
}
