import { Status } from '@presentation/pages/administrative-infrastructure/domain/enums/infrastructure-type/infrastructure-type-status.enum';

export interface InfrastructureTypeFilterDto {
    search?: string;
    profile?: string;
    role?: string;
    isActive?: Status;
}
