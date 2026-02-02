import { AgentsPerformancesItemApiDto } from '@presentation/pages/team-organization/infrastructure/api/dtos/agents-performances/agents-performances-response-api.dto';

export class AgentsPerformancesEntity {
    constructor(
        public readonly uniqId: string,
        public name: string,
        public goalsSize: string,
        public achievementsSize: string,
        public percentages: string,
        public isActive: boolean,
        public createdAt: string
    ) {}

    static fromDto(
        dto: AgentsPerformancesItemApiDto
    ): AgentsPerformancesEntity {
        return new AgentsPerformancesEntity(
            dto.id,
            dto.name,
            dto.goals_size,
            dto.achievements_size,
            dto.percentages,
            dto.is_active,
            dto.created_at
        );
    }

    public with(dto: AgentsPerformancesItemApiDto): AgentsPerformancesEntity {
        if (this.createdAt === dto.created_at) {
            return this;
        }
        return AgentsPerformancesEntity.fromDto(dto);
    }
}
