import {
    Status,
    StatusStyle,
} from '@pages/requests/domain/enums/all/all-status.enum';
import { AllProps } from '@pages/requests/domain/interfaces/all/all-props.interface';
import { ReportSource } from '@shared/domain/enums/report-source.enum';
import { ReportType } from '@shared/domain/enums/report-type.enum';
import {
    TelecomOperator,
    TelecomOperatorStyle,
} from '@shared/domain/enums/telecom-operator.enum';

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

    public with(props: AllProps): AllEntity {
        if (
            this.updatedAt === props.updatedAt &&
            this.uniqId === props.uniqId
        ) {
            return this;
        }
        return new AllEntity(props);
    }
}
