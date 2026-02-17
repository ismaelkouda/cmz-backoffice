import { TeamsFreeParticipantsAssignDto } from '@presentation/pages/team-organization/application/dto/teams/teams-free-participants-assign.dto';

export class TeamsFreeParticipantsAssignVo {
    public readonly uniqId: string;
    public readonly participants: string[];

    constructor(props: { uniqId: string; participants: string[] }) {
        this.uniqId = props.uniqId;
        this.participants = props.participants;
    }

    static fromDto(
        dto: TeamsFreeParticipantsAssignDto
    ): TeamsFreeParticipantsAssignVo {
        const uniqId = dto?.uniqId;
        const participants =
            dto?.participants?.map((participant) => participant?.trim()) || [];

        if (!uniqId) {
            throw new Error('uniqId is required to assign Teams Participants');
        }

        if (!participants.length) {
            throw new Error(
                'participants is required to assign Teams Participants'
            );
        }

        return new TeamsFreeParticipantsAssignVo({
            uniqId,
            participants,
        });
    }
}
