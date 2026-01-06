import { ReportSource } from '@shared/domain/enums/report-source.enum';
import { ReportType } from '@shared/domain/enums/report-type.enum';
import { TelecomOperator } from '@shared/domain/enums/telecom-operator.enum';

export enum ReportState {
    TERMINATED = 'REPORTS_PROCESSING.ALL.STATE.TERMINATED',
}

export interface All {
    readonly uniqId: string;
    readonly reportType: ReportType;
    readonly operators: TelecomOperator[];
    readonly source: ReportSource;
    readonly initiatorPhoneNumber: string;
    readonly status: ReportState;
    readonly createdAt: string;
}

export class AllEntity implements All {
    constructor(
        public readonly uniqId: string,
        public readonly reportType: ReportType,
        public readonly operators: TelecomOperator[],
        public readonly source: ReportSource,
        public readonly initiatorPhoneNumber: string,
        public readonly status: ReportState,
        public readonly createdAt: string
    ) {}

    public clone(updates: Partial<All>): AllEntity {
        return new AllEntity(
            updates.uniqId ?? this.uniqId,
            updates.reportType ?? this.reportType,
            updates.operators ?? this.operators,
            updates.source ?? this.source,
            updates.initiatorPhoneNumber ?? this.initiatorPhoneNumber,
            updates.status ?? this.status,
            updates.createdAt ?? this.createdAt
        );
    }
}
