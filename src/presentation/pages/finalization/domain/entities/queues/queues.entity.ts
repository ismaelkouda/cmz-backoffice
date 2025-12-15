import { ReportSource } from '@shared/domain/enums/report-source.enum';
import { ReportType } from '@shared/domain/enums/report-type.enum';
import { TelecomOperator } from '@shared/domain/enums/telecom-operator.enum';

export interface Queues {
    readonly uniqId: string;
    readonly reportType: ReportType;
    readonly operators: TelecomOperator[];
    readonly source: ReportSource;
    readonly initiatorPhoneNumber: string;
    readonly createdAt: string;
}

export class QueuesEntity implements Queues {
    constructor(
        public readonly uniqId: string,
        public readonly reportType: ReportType,
        public readonly operators: TelecomOperator[],
        public readonly source: ReportSource,
        public readonly initiatorPhoneNumber: string,
        public readonly createdAt: string,
    ) { }

    public clone(updates: Partial<Queues>): QueuesEntity {
        return new QueuesEntity(
            updates.uniqId ?? this.uniqId,
            updates.reportType ?? this.reportType,
            updates.operators ?? this.operators,
            updates.source ?? this.source,
            updates.initiatorPhoneNumber ?? this.initiatorPhoneNumber,
            updates.createdAt ?? this.createdAt,
        );
    }
}
