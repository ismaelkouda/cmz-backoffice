import { ParticipantsFilterDto } from '@pages/team-organization/application/dto/participants/participants-filter.dto';
import { Roles } from '@shared/domain/enums/roles.enum';

export class ParticipantsFilterVo {
    public readonly search?: string;
    public readonly role?: Roles;
    public readonly team?: string;
    public readonly status?: string;

    constructor(props: {
        search?: string;
        role?: Roles;
        team?: string;
        status?: string;
    }) {
        this.search = props.search;
        this.role = props.role;
        this.team = props.team;
        this.status = props.status;
    }

    static fromDto(
        dto: ParticipantsFilterDto | null = {} as ParticipantsFilterDto
    ): ParticipantsFilterVo {
        return new ParticipantsFilterVo({
            search: dto?.search?.trim() || undefined,
            role: dto?.role,
            team: dto?.team,
            status: dto?.status,
        });
    }
}
