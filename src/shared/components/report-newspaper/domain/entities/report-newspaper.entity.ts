import { ReportNewspaperProps } from '@shared/components/report-newspaper/domain/interfaces/report-newspaper.interface';

export interface ReportNewspaperContext {
    props: ReportNewspaperProps;
    permissions: {
        canTake: boolean;
        canQualify: boolean;
    };
}

export interface ReportNewspaperRule {
    name: string;
    when: (ctx: ReportNewspaperContext) => boolean;
    title: string;
}
export class ReportNewspaperEntity {
    constructor(private readonly props: ReportNewspaperProps) {}

    get uniqId(): string {
        return this.props.uniqId;
    }

    get operation(): string {
        return this.props.operation;
    }

    get description(): string {
        return this.props.description;
    }

    get createdAt(): string {
        return this.props.createdAt;
    }

    get updatedAt(): string {
        return this.props.updatedAt;
    }

    public with(props: ReportNewspaperProps): ReportNewspaperEntity {
        if (
            this.updatedAt === props.updatedAt &&
            this.uniqId === props.uniqId
        ) {
            return this;
        }
        return new ReportNewspaperEntity(props);
    }
}
