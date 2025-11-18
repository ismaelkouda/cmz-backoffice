export interface WaitingFilterPayloadEntity {
    created_from: string;
    created_to: string;
    report_type?: string;
    state?: string;
    operator?: string;
}
