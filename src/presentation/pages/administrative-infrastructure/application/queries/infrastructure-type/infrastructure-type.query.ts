import { Status } from '@presentation/pages/administrative-infrastructure/domain/enums/infrastructure-type/infrastructure-type-status.enum';
export class InfrastructureTypeQuery {
    constructor(
        public readonly search?: string,
        public readonly status?: Status,
        public readonly startDate?: Date,
        public readonly endDate?: Date
    ) {}
}
