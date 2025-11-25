export interface NewspapersFilterPayloadEntity {
    reportUniqId: string;
    created_from?: string;
    created_to?: string;
    report_type?: string;
    source?: string;
    operator?: string[];
}
