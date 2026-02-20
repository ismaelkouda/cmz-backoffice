import { Status } from '@presentation/pages/requests/domain/enums/all-status.enum.ts/all-status.enum';
export interface AllTable {
    uniqId: string;
    initiatorPhoneNumber: string;

    reportType: string;
    reportTypeLabel: string;

    source: string;
    sourceLabel: string;

    operators: string[];
    operatorsLabels: string[];

    status: Status;

    reportedAt: string;
}
