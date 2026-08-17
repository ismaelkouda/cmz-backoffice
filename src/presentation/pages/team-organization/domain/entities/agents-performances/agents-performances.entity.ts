import { Status } from '@pages/team-organization/domain/enums/agents-performances/agents-performances-status.enum';
import { ActorEntity } from '@shared/domain/entities/actor.entity';

export interface AgentsPerformancesProps {
    uniqId: string;
    user: ActorEntity;
    goalsSize: string;
    achievementsSize: string;
    percentages: string;
    status: Status;
    createdAt: string;
}
export class AgentsPerformancesEntity {
    constructor(private readonly props: AgentsPerformancesProps) {}

    get uniqId(): string {
        return this.props.uniqId;
    }
    get user(): ActorEntity {
        return this.props.user;
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
    get status(): Status {
        return this.props.status;
    }
    get createdAt(): string {
        return this.props.createdAt;
    }

    public with(props: AgentsPerformancesProps): AgentsPerformancesEntity {
        if (
            this.uniqId === props.uniqId &&
            this.createdAt === props.createdAt
        ) {
            return this;
        }
        return new AgentsPerformancesEntity(props);
    }
}
