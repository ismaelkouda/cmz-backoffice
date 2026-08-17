import {
    Status,
    StatusStyle,
} from '@pages/report-states/domain/enums/reject/reject-status.enum';
import { TelecomOperator } from '@shared/domain/enums/telecom-operator.enum';
import { TypeReport } from '@shared/domain/enums/type-report.enum';

export interface RejectVmProps {
    uniqId: string;
    type: TypeReport;
    reportTypeLabel: string;
    operators: TelecomOperator[];
    sourceLabel: string;
    status: Status;
    statusLabel: string;
    statusStyle: StatusStyle;
    initiatorPhoneNumber: string;
    reportedAt: string;
    actionsRef: string;
    tooltipButtonView: string;
    disableButtonView: boolean;
}
