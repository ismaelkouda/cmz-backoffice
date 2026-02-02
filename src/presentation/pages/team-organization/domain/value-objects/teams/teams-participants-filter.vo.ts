import { TeamsParticipantsFilterDto } from '@presentation/pages/team-organization/application/dtos/teams/teams-participants-filter.dto';

export class TeamsParticipantsFilterVo {
    public readonly uniqId: string;
    public readonly search?: string;
    public readonly participantEmail?: string;
    public readonly phone?: string;

    constructor(props: {
        uniqId: string;
        search?: string;
        participantEmail?: string;
        phone?: string;
    }) {
        this.uniqId = props.uniqId;
        this.search = props.search;
        this.participantEmail = props.participantEmail;
        this.phone = props.phone;
    }

    static fromDto(
        dto: TeamsParticipantsFilterDto | null = {} as TeamsParticipantsFilterDto
    ): TeamsParticipantsFilterVo {
        const uniqId = dto?.uniqId;
        const search = dto?.search?.trim() || undefined;
        const participantEmail = dto?.participantEmail?.trim() || undefined;
        const phone = dto?.phone?.trim() || undefined;

        if (!uniqId) {
            throw new Error('uniqId is required to get Teams Participants');
        }

        return new TeamsParticipantsFilterVo({
            uniqId,
            search,
            participantEmail,
            phone,
        });
    }
}
