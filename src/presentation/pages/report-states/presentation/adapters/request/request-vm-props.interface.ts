import { TelecomOperator } from '@shared/domain/enums/telecom-operator.enum';

export interface RequestVmProps {
    uniqId: string;
    reportTypeLabel: string;
    operators: TelecomOperator[];
    sourceLabel: string;
    initiatorPhoneNumber: string;
    reportedAt: string;
}
