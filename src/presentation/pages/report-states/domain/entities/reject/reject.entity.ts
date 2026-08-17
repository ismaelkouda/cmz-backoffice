import {
    Status,
    StatusStyle,
} from '@pages/report-states/domain/enums/reject/reject-status.enum';
import { RejectProps } from '@pages/report-states/domain/interfaces/reject/reject-props.interface';
import { ReportSource } from '@shared/domain/enums/report-source.enum';
import { ReportType } from '@shared/domain/enums/report-type.enum';
import {
    TelecomOperator,
    TelecomOperatorStyle,
} from '@shared/domain/enums/telecom-operator.enum';
import { TypeReport } from '@shared/domain/enums/type-report.enum';

export class RejectEntity implements RejectProps {
    constructor(private readonly props: RejectProps) {}

    get type(): TypeReport {
        return this.props.type;
    }

    get actionsRef(): string {
        return this.props.uniqId;
    }

    get uniqId(): string {
        return this.props.uniqId;
    }

    get reportType(): ReportType {
        return this.props.reportType;
    }

    get operators(): TelecomOperator[] {
        return this.props.operators;
    }

    operatorsStyle(operator: TelecomOperator): TelecomOperatorStyle {
        const methodMap: Record<TelecomOperator, TelecomOperatorStyle> = {
            [TelecomOperator.MTN]: TelecomOperatorStyle.MTN,
            [TelecomOperator.ORANGE]: TelecomOperatorStyle.ORANGE,
            [TelecomOperator.MOOV]: TelecomOperatorStyle.MOOV,
        };
        return methodMap[operator];
    }

    get source(): ReportSource {
        return this.props.source;
    }

    get initiatorPhoneNumber(): string {
        return this.props.initiatorPhoneNumber;
    }

    get status(): Status {
        return this.props.status;
    }
    statusStyle(status: Status): StatusStyle {
        const methodMap: Record<Status, StatusStyle> = {
            [Status.ABANDONED]: StatusStyle.ABANDONED,
            [Status.APPROVED]: StatusStyle.APPROVED,
            [Status.CONFIRMED]: StatusStyle.CONFIRMED,
            [Status.IN_PROGRESS]: StatusStyle.IN_PROGRESS,
            [Status.REJECTED]: StatusStyle.REJECTED,
            [Status.TERMINATED]: StatusStyle.TERMINATED,
        };
        return methodMap[status];
    }

    get reportedAt(): string {
        return this.props.reportedAt;
    }

    get updatedAt(): string {
        return this.props.updatedAt;
    }

    public with(props: RejectProps): RejectEntity {
        if (
            this.updatedAt === props.updatedAt &&
            this.uniqId === props.uniqId
        ) {
            return this;
        }
        return new RejectEntity(props);
    }
}
