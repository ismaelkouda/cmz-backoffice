import { Status } from '@pages/report-states/domain/enums/reject/reject-status.enum';
import { ReportSource } from '@shared/domain/enums/report-source.enum';
import { ReportType } from '@shared/domain/enums/report-type.enum';
import { TelecomOperator } from '@shared/domain/enums/telecom-operator.enum';
import { TypeReport } from '@shared/domain/enums/type-report.enum';

export interface RejectProps {
    type: TypeReport;
    uniqId: string;
    reportType: ReportType;
    operators: TelecomOperator[];
    source: ReportSource;
    initiatorPhoneNumber: string;
    status: Status;
    reportedAt: string;
    updatedAt: string;
}
