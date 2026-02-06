import { TeamsFilterDto } from '@presentation/pages/team-organization/application/dtos/teams/teams-filter.dto';

export class TeamsFilterVo {
    public readonly search?: string;
    public readonly member?: string;
    public readonly isActive?: boolean;

    constructor(props: {
        search?: string;
        member?: string;
        isActive?: boolean;
    }) {
        this.search = props.search;
        this.member = props.member;
        this.isActive = props.isActive;
    }

    static fromDto(
        dto: TeamsFilterDto | null = {} as TeamsFilterDto
    ): TeamsFilterVo {
        return new TeamsFilterVo({
            search: dto?.search?.trim() || undefined,
            member: dto?.member,
            isActive: dto?.isActive,
        });
    }
}
