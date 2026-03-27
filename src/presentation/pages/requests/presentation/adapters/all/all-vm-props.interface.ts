import {
    Status,
    StatusStyle,
} from '@pages/requests/domain/enums/all/all-status.enum';
import { TelecomOperator } from '@shared/domain/enums/telecom-operator.enum';
import { TypeReport } from '@shared/domain/enums/type-report.enum';

export interface AllVmProps {
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
}
