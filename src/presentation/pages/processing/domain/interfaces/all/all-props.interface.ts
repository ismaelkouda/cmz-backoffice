import { ReportSource } from '@shared/domain/enums/report-source.enum';
import { ReportType } from '@shared/domain/enums/report-type.enum';
import { TelecomOperator } from '@shared/domain/enums/telecom-operator.enum';

export interface AllProps {
    uniqId: string;
    reportType: ReportType;
    operators: TelecomOperator[];
    source: ReportSource;
    initiatorPhoneNumber: string;
    reportedAt: string;
}
