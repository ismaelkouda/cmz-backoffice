import { ReportSource } from '@shared/domain/enums/report-source.enum';
import { ReportType } from '@shared/domain/enums/report-type.enum';
import { TelecomOperator } from '@shared/domain/enums/telecom-operator.enum';

import { TasksProps } from '@presentation/pages/finalization/domain/interfaces/tasks/tasks-props.interface';

export class TasksEntity implements TasksProps {
    constructor(private readonly props: TasksProps) {}

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

    public with(props: TasksProps): TasksEntity {
        if (this.uniqId === props.uniqId) {
            return this;
        }
        return new TasksEntity(props);
    }
}
