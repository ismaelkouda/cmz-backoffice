import { Status } from '@presentation/pages/administrative-infrastructure/domain/enums/infrastructure-type/infrastructure-type-status.enum';

export interface InfrastructureTypeProps {
    uniqId: string;
    name: string;
    description: string;
    status: Status;
    updatedAt: string;
}
