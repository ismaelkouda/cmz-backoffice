import { ReportSource } from '@shared/domain/enums/report-source.enum';
import { ReportType } from '@shared/domain/enums/report-type.enum';
import { TelecomOperator } from '@shared/domain/enums/telecom-operator.enum';
import { TypeReport } from '@shared/domain/enums/type-report.enum';

export interface CloseProps {
    type: TypeReport;
    uniqId: string;
    reportType: ReportType;
    operators: TelecomOperator[];
    source: ReportSource;
    initiatorPhoneNumber: string;
    reportedAt: string;
    updatedAt: string;
}
