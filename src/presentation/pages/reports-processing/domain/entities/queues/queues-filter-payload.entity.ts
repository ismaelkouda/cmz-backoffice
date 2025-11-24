export interface QueuesFilterPayloadEntity {
    uniq_id: string;
    created_from: string;
    created_to: string;
    report_type?: string;
    operator?: string;
}
