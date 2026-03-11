import { TeamsParticipantsFilterDto } from '@pages/team-organization/application/dto/teams/teams-participants-filter.dto';

export class TeamsParticipantsFilterVo {
    public readonly uniqId: string;
    public readonly search?: string;

    constructor(props: { uniqId: string; search?: string }) {
        this.uniqId = props.uniqId;
        this.search = props.search;
    }

    static fromDto(
        dto: TeamsParticipantsFilterDto | null = {} as TeamsParticipantsFilterDto
    ): TeamsParticipantsFilterVo {
        const uniqId = dto?.uniqId;
        const search = dto?.search?.trim() || undefined;

        if (!uniqId) {
            throw new Error('uniqId is required to get Teams Participants');
        }

        return new TeamsParticipantsFilterVo({
            uniqId,
            search,
        });
    }
}
