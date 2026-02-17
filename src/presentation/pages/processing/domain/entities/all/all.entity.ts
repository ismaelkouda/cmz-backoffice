import { ReportSource } from '@shared/domain/enums/report-source.enum';
import { ReportType } from '@shared/domain/enums/report-type.enum';
import { TelecomOperator } from '@shared/domain/enums/telecom-operator.enum';

export enum ReportState {
    TERMINATED = 'PROCESSING.ALL.STATE.TERMINATED',
}

export interface AllProps {
    uniqId: string;
    reportType: ReportType;
    operators: TelecomOperator[];
    source: ReportSource;
    initiatorPhoneNumber: string;
    state: string;
    reportedAt: string;
}

export class AllEntity implements AllProps {
    constructor(private readonly props: AllProps) {}

    get uniqId(): string {
        return this.props.uniqId;
    }

    get reportType(): ReportType {
        return this.props.reportType;
    }

    get operators(): TelecomOperator[] {
        return this.props.operators;
    }

    get source(): ReportSource {
        return this.props.source;
    }

    get initiatorPhoneNumber(): string {
        return this.props.initiatorPhoneNumber;
    }

    get state(): string {
        return this.props.state;
    }

    get reportedAt(): string {
        return this.props.reportedAt;
    }

    public with(props: AllProps): AllEntity {
        if (this.uniqId === props.uniqId) {
            return this;
        }
        return new AllEntity(props);
    }
}
