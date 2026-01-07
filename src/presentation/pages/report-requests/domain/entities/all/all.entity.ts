import { ReportSource } from '@shared/domain/enums/report-source.enum';
import { ReportType } from '@shared/domain/enums/report-type.enum';
import { TelecomOperator } from '@shared/domain/enums/telecom-operator.enum';

export enum ReportStatus {
    CONFIRMED = 'REPORTS_REQUESTS.ALL.STATUS.CONFIRMED',
    APPROVED = 'REPORTS_REQUESTS.ALL.STATUS.APPROVED',
    REJECTED = 'REPORTS_REQUESTS.ALL.STATUS.REJECTED',
    ABANDONED = 'REPORTS_REQUESTS.ALL.STATUS.ABANDONED',
    UNKNOWN = 'REPORTS_REQUESTS.ALL.STATUS.UNKNOWN',
}

export interface All {
    readonly uniqId: string;
    readonly reportType: ReportType;
    readonly operators: TelecomOperator[];
    readonly source: ReportSource;
    readonly initiatorPhoneNumber: string;
    readonly status: ReportStatus;
    readonly reportedAt: string;
}

export class AllEntity implements All {
    constructor(
        public readonly uniqId: string,
        public readonly reportType: ReportType,
        public readonly operators: TelecomOperator[],
        public readonly source: ReportSource,
        public readonly initiatorPhoneNumber: string,
        public readonly status: ReportStatus,
        public readonly reportedAt: string
    ) { }

    public clone(updates: Partial<All>): AllEntity {
        return new AllEntity(
            updates.uniqId ?? this.uniqId,
            updates.reportType ?? this.reportType,
            updates.operators ?? this.operators,
            updates.source ?? this.source,
            updates.initiatorPhoneNumber ?? this.initiatorPhoneNumber,
            updates.status ?? this.status,
            updates.reportedAt ?? this.reportedAt
        );
    }
}
