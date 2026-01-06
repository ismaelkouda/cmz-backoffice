import { ReportSource } from '@shared/domain/enums/report-source.enum';
import { ReportType } from '@shared/domain/enums/report-type.enum';
import { TelecomOperator } from '@shared/domain/enums/telecom-operator.enum';

export interface Tasks {
    readonly uniqId: string;
    readonly reportType: ReportType;
    readonly operators: TelecomOperator[];
    readonly source: ReportSource;
    readonly initiatorPhoneNumber: string;
    readonly reportedAt: string;
}

export class TasksEntity implements Tasks {
    constructor(
        public readonly uniqId: string,
        public readonly reportType: ReportType,
        public readonly operators: TelecomOperator[],
        public readonly source: ReportSource,
        public readonly initiatorPhoneNumber: string,
        public readonly reportedAt: string
    ) { }

    public clone(updates: Partial<Tasks>): TasksEntity {
        return new TasksEntity(
            updates.uniqId ?? this.uniqId,
            updates.reportType ?? this.reportType,
            updates.operators ?? this.operators,
            updates.source ?? this.source,
            updates.initiatorPhoneNumber ?? this.initiatorPhoneNumber,
            updates.reportedAt ?? this.reportedAt
        );
    }
}
