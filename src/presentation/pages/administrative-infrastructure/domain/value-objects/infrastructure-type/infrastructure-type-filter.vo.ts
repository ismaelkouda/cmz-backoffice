import { InfrastructureTypeFilterDto } from '@presentation/pages/administrative-infrastructure/application/dto/infrastructure-type/infrastructure-type-filter.dto';

export class InfrastructureTypeFilterVo {
    public readonly search?: string;
    public readonly profile?: string;
    public readonly role?: string;
    public readonly isActive?: string;

    constructor(props: {
        search?: string;
        profile?: string;
        role?: string;
        isActive?: string;
    }) {
        this.search = props.search;
        this.profile = props.profile;
        this.role = props.role;
        this.isActive = props.isActive;
    }

    static fromDto(
        dto: InfrastructureTypeFilterDto | null = {} as InfrastructureTypeFilterDto
    ): InfrastructureTypeFilterVo {
        return new InfrastructureTypeFilterVo({
            search: dto?.search?.trim() || undefined,
            profile: dto?.profile,
            role: dto?.role,
            isActive: dto?.isActive,
        });
    }
}
