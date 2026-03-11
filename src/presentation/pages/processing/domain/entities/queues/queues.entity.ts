import { QueuesProps } from '@pages/processing/domain/interfaces/queues/queues-props.interface';
import { ReportSource } from '@shared/domain/enums/report-source.enum';
import { ReportType } from '@shared/domain/enums/report-type.enum';
import { TelecomOperator } from '@shared/domain/enums/telecom-operator.enum';

export class QueuesEntity implements QueuesProps {
    constructor(private readonly props: QueuesProps) {}

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

    get reportedAt(): string {
        return this.props.reportedAt;
    }

    public with(props: QueuesProps): QueuesEntity {
        if (this.uniqId === props.uniqId) {
            return this;
        }
        return new QueuesEntity(props);
    }
}
