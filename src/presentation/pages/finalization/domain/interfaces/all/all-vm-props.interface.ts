import { TelecomOperator } from '@shared/domain/enums/telecom-operator.enum';
import { TypeReport } from '@shared/domain/enums/type-report.enum';

export interface AllVmProps {
    uniqId: string;
    type: TypeReport;
    reportTypeLabel: string;
    operators: TelecomOperator[];
    sourceLabel: string;
    initiatorPhoneNumber: string;
    reportedAt: string;
    actionsRef: string;
    tooltipButtonView: string;
    disableButtonView: boolean;
}
