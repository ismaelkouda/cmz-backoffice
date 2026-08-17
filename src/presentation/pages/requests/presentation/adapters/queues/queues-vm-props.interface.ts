import { TypeReport } from '@shared/domain/enums/type-report.enum';

export interface QueuesVmProps {
    uniqId: string;
    type: TypeReport;
    reportTypeLabel: string;
    operators: string[];
    sourceLabel: string;
    initiatorPhoneNumber: string;
    reportedAt: string;
    actionsRef: string;

    tooltipButtonTake: string;
    disableButtonTake: boolean;
}
