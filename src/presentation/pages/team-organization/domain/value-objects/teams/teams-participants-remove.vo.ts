import { TeamsParticipantsRemoveDto } from '@presentation/pages/team-organization/application/dtos/teams/teams-participants-remove.dto';

export class TeamsParticipantsRemoveVo {
    public readonly uniqId: string;
    public readonly participants: string[];

    constructor(props: { uniqId: string; participants: string[] }) {
        this.uniqId = props.uniqId;
        this.participants = props.participants;
    }

    static fromDto(dto: TeamsParticipantsRemoveDto): TeamsParticipantsRemoveVo {
        const uniqId = dto?.uniqId;
        const participants =
            dto?.participants?.map((participant) => participant?.trim()) || [];

        if (!uniqId) {
            throw new Error('uniqId is required to remove Teams Participants');
        }

        if (!participants.length) {
            throw new Error(
                'participants is required to remove Teams Participants'
            );
        }

        return new TeamsParticipantsRemoveVo({
            uniqId,
            participants,
        });
    }
}
