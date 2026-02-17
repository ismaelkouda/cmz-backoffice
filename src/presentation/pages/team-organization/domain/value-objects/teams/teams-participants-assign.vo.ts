export class TeamsParticipantsAssignVo {
    private constructor(
        public readonly uniqId: string,
        public readonly participants: string[]
    ) {}

    static create(props: {
        uniqId: string;
        participants: string[];
    }): TeamsParticipantsAssignVo {
        const uniqId = props?.uniqId?.trim();
        const participants = props?.participants?.map((p) => p.trim()) ?? [];

        if (!uniqId) {
            throw new Error('uniqId is required');
        }
        if (!participants.length) {
            throw new Error('participants required');
        }

        return new TeamsParticipantsAssignVo(uniqId, participants);
    }
}
