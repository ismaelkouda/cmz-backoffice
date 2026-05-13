export class ParticipantsQuery {
    constructor(
        public readonly search?: string,
        public readonly role?: string,
        public readonly status?: string
    ) {}
}
