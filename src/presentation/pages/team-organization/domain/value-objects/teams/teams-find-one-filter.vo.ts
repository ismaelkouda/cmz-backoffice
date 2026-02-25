import { TeamsFindOneFilterDto } from '@presentation/pages/team-organization/application/dto/teams/teams-find-one-filter.dto';

export class TeamsFindOneFilterVo {
    public readonly uniqId?: string;

    constructor(props: { uniqId?: string }) {
        this.uniqId = props.uniqId;
    }

    static fromDto(
        dto: TeamsFindOneFilterDto | null = {} as TeamsFindOneFilterDto
    ): TeamsFindOneFilterVo {
        return new TeamsFindOneFilterVo({
            uniqId: dto?.uniqId,
        });
    }
}
