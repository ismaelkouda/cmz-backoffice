export class TeamsParticipantsRemoveCommand {
    constructor(
        public readonly uniqId: string,
        public readonly participants: string[]
    ) {}
}
