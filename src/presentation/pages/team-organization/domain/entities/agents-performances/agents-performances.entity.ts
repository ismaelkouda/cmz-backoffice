import { AGENTS_PERFORMANCES_STATUS } from '@presentation/pages/team-organization/domain/enums/agents-performances/agents-performances-status.enum';

export interface AgentsPerformancesProps {
    uniqId: string;
    name: string;
    goalsSize: string;
    achievementsSize: string;
    percentages: string;
    status: AGENTS_PERFORMANCES_STATUS;
    createdAt: string;
}
export class AgentsPerformancesEntity {
    constructor(private readonly props: AgentsPerformancesProps) {}

    get uniqId(): string {
        return this.props.uniqId;
    }
    get name(): string {
        return this.props.name;
    }
    get goalsSize(): string {
        return this.props.goalsSize;
    }
    get achievementsSize(): string {
        return this.props.achievementsSize;
    }
    get percentages(): string {
        return this.props.percentages;
    }
    get status(): string {
        return this.props.status;
    }
    get createdAt(): string {
        return this.props.name;
    }

    public with(props: AgentsPerformancesProps): AgentsPerformancesEntity {
        if (this.uniqId === props.uniqId) {
            return this;
        }
        return new AgentsPerformancesEntity(props);
    }
}
