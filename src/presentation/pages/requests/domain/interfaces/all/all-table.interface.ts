export interface AllTable {
    uniqId: string;
    initiatorPhoneNumber: string;

    reportType: string;
    reportTypeLabel: string;

    source: string;
    sourceLabel: string;

    operators: string[];
    operatorsLabels: string[];

    state: string;

    reportedAt: string;
}
