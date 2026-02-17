import { ParticipantsFilterDto } from '@presentation/pages/team-organization/application/dto/participants/participants-filter.dto';

export class ParticipantsFilterVo {
    public readonly search?: string;
    public readonly role?: string;
    public readonly isActive?: string;

    constructor(props: { search?: string; role?: string; isActive?: string }) {
        this.search = props.search;
        this.role = props.role;
        this.isActive = props.isActive;
    }

    static fromDto(
        dto: ParticipantsFilterDto | null = {} as ParticipantsFilterDto
    ): ParticipantsFilterVo {
        return new ParticipantsFilterVo({
            search: dto?.search?.trim() || undefined,
            role: dto?.role,
            isActive: dto?.isActive,
        });
    }
}
