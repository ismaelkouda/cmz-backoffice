export interface QueuesTable {
    uniqId: string;
    initiatorPhoneNumber: string;

    reportType: string;
    reportTypeLabel: string;

    source: string;
    sourceLabel: string;

    operators: string[];
    operatorsLabels: string[];

    reportedAt: string;
}
