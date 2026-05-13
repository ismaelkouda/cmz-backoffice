import { ParticipantsFilterDto } from '@pages/team-organization/application/dto/participants/participants-filter.dto';

export class ParticipantsFilterVo {
    public readonly search?: string;
    public readonly role?: string;
    public readonly status?: string;

    constructor(props: { search?: string; role?: string; status?: string }) {
        this.search = props.search;
        this.role = props.role;
        this.status = props.status;
    }

    static fromDto(
        dto: ParticipantsFilterDto | null = {} as ParticipantsFilterDto
    ): ParticipantsFilterVo {
        return new ParticipantsFilterVo({
            search: dto?.search?.trim() || undefined,
            role: dto?.role,
            status: dto?.status,
        });
    }
}
