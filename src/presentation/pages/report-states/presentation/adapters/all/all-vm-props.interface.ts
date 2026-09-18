import {
    Conformity,
    ConformityStyle,
} from '@presentation/pages/processing/domain/enums/tasks/tasks-actions-conformity.enum';
import { TelecomOperator } from '@shared/domain/enums/telecom-operator.enum';
import { TypeReport } from '@shared/domain/enums/type-report.enum';

export interface AllVmProps {
    uniqId: string;
    requestReportUniqId: string;
    type: TypeReport;
    reportTypeLabel: string;
    operators: TelecomOperator[];
    sourceLabel: string;
    initiatorPhoneNumber: string;
    reportedAt: string;
    isConform: Conformity;
    conformLabel: string;
    conformStyle: ConformityStyle;
    actionsRef: string;

    tooltipButtonTasksList: string;
    tooltipButtonQualify: string;
    disableButtonQualify: boolean;
}
