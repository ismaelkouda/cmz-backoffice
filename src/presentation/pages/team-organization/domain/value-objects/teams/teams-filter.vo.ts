import { TeamsFilterDto } from '@pages/team-organization/application/dto/teams/teams-filter.dto';
import { Status } from '@pages/team-organization/domain/enums/teams/teams-status.enum';
export class TeamsFilterVo {
    public readonly search?: string;
    public readonly member?: string;
    public readonly status?: Status;

    constructor(props: { search?: string; member?: string; status?: Status }) {
        this.search = props.search;
        this.member = props.member;
        this.status = props.status;
    }

    static fromDto(
        dto: TeamsFilterDto | null = {} as TeamsFilterDto
    ): TeamsFilterVo {
        return new TeamsFilterVo({
            search: dto?.search?.trim() || undefined,
            member: dto?.member,
            status: dto?.status,
        });
    }
}
