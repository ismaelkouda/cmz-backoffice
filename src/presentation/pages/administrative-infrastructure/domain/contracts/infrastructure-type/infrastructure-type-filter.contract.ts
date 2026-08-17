import { Status } from '@presentation/pages/administrative-infrastructure/domain/enums/infrastructure-type/infrastructure-type-status.enum';

export interface InfrastructureTypeFilterContract {
    search?: string;
    status?: Status;
    startDate?: Date;
    endDate?: Date;
}
