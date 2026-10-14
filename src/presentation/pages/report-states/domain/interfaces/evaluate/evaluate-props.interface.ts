import { ReportSource } from '@shared/domain/enums/report-source.enum';
import { ReportType } from '@shared/domain/enums/report-type.enum';
import { TelecomOperator } from '@shared/domain/enums/telecom-operator.enum';
import { TypeReport } from '@shared/domain/enums/type-report.enum';
import { Conformity } from '@presentation/pages/processing/domain/enums/tasks/tasks-actions-conformity.enum';

export interface EvaluateProps {
    type: TypeReport;
    uniqId: string;
    requestReportUniqId: string;
    reportType: ReportType;
    operators: TelecomOperator[];
    source: ReportSource;
    initiatorPhoneNumber: string;
    requestReportsCount: number;
    reportedAt: string;
    isConform: Conformity;
    updatedAt: string;
}
